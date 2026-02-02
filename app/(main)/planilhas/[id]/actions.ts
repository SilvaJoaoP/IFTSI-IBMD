"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TipoRegistro } from "@prisma/client";
import { copyFixedExpensesFromPreviousMonth, monthMap, monthNames } from "@/lib/finance";

export async function getSaldoAnterior(mes: string, ano: number) {
  const currentMonthIndex = monthMap[mes];
  if (currentMonthIndex === undefined) return null;

  try {
    const planilhas = await prisma.planilha.findMany({
      include: {
        registros: true,
      },
    });

    let saldo = 0;
    let hasPrevious = false;

    for (const p of planilhas) {
      const pMonthIndex = monthMap[p.mes];
      if (pMonthIndex === undefined) continue;

      if (p.ano < ano || (p.ano === ano && pMonthIndex < currentMonthIndex)) {
        hasPrevious = true;
        const entradas = p.registros
          .filter((r) => r.tipo === TipoRegistro.ENTRADA)
          .reduce((acc, r) => acc + r.valor, 0);
        const saidas = p.registros
          .filter(
            (r) =>
              r.tipo === TipoRegistro.SAIDA_FIXA ||
              r.tipo === TipoRegistro.SAIDA_VARIAVEL
          )
          .reduce((acc, r) => acc + r.valor, 0);
        saldo += entradas - saidas;
      }
    }

    return hasPrevious ? saldo : null;
  } catch (error) {
    console.error("Erro ao calcular saldo anterior:", error);
    return null;
  }
}

export async function getPlanilhaDetails(id: string) {
  try {
    const planilha = await prisma.planilha.findUnique({
      where: { id },
      include: {
        registros: {
          orderBy: {
            data: "asc",
          },
        },
      },
    });
    return planilha;
  } catch (error) {
    console.error("Erro ao buscar detalhes da planilha:", error);
    return null;
  }
}

export async function createRegistroFinanceiro(formData: FormData) {
  const planilhaId = formData.get("planilhaId") as string;
  const descricao = formData.get("description") as string;
  const valor = Number(formData.get("value"));
  const dateStr = formData.get("date") as string;
  const data = new Date(`${dateStr}T12:00:00Z`);
  const tipo = formData.get("tipo") as TipoRegistro;
  const contaDigital = formData.get("contaDigital") === "on";
  
  // Campos novos para parcelamento
  const parcelado = formData.get("parcelado") === "on";
  const totalParcelas = parcelado ? Number(formData.get("totalParcelas")) : 1;

  if (!planilhaId || !descricao || !valor || !data || !tipo) {
    return;
  }

  try {
    const grupoId = crypto.randomUUID();

    // Se for Saída Fixa, marca como recorrente e ativo
    const isRecorrente = tipo === TipoRegistro.SAIDA_FIXA;

    if (parcelado && tipo === TipoRegistro.SAIDA_VARIAVEL) {
      // Lógica de Parcelamento
      for (let i = 0; i < totalParcelas; i++) {
        const parcelaNum = i + 1;
        const dataParcela = new Date(data);
        dataParcela.setMonth(data.getMonth() + i);
        
        // Encontrar ou criar planilha para o mês da parcela
        const mesNome = monthNames[dataParcela.getMonth()];
        const anoParcela = dataParcela.getFullYear();

        let targetPlanilhaId = planilhaId;

        // Se não for a primeira parcela, precisamos achar a planilha correta
        if (i > 0) {
          let targetPlanilha = await prisma.planilha.findFirst({
            where: { mes: mesNome, ano: anoParcela },
          });

          if (!targetPlanilha) {
            targetPlanilha = await prisma.planilha.create({
              data: { mes: mesNome, ano: anoParcela },
            });
            // Copiar saídas fixas do mês anterior para a nova planilha criada automaticamente
            await copyFixedExpensesFromPreviousMonth(targetPlanilha.id, mesNome, anoParcela);
          }
          targetPlanilhaId = targetPlanilha.id;
        }

        await prisma.registroFinanceiro.create({
          data: {
            descricao: `${descricao} (${parcelaNum}/${totalParcelas})`,
            valor,
            data: dataParcela,
            tipo,
            contaDigital,
            recorrente: false,
            ativo: true,
            parcelaAtual: parcelaNum,
            totalParcelas,
            grupoId,
            planilhaId: targetPlanilhaId,
          },
        });
      }
    } else {
      // Registro Normal (ou Saída Fixa)
      await prisma.registroFinanceiro.create({
        data: {
          descricao,
          valor,
          data,
          tipo,
          contaDigital,
          recorrente: isRecorrente,
          ativo: true,
          planilhaId,
        },
      });

      // Se for Saída Fixa, propagar para planilhas futuras JÁ EXISTENTES
      if (isRecorrente) {
        const currentPlanilha = await prisma.planilha.findUnique({
          where: { id: planilhaId },
        });

        if (currentPlanilha) {
          const monthMap: { [key: string]: number } = {
            Janeiro: 0, Fevereiro: 1, Março: 2, Abril: 3, Maio: 4, Junho: 5,
            Julho: 6, Agosto: 7, Setembro: 8, Outubro: 9, Novembro: 10, Dezembro: 11,
          };

          const currentMonthIndex = monthMap[currentPlanilha.mes];
          const currentYear = currentPlanilha.ano;

          // Buscar todas as planilhas futuras
          const futurePlanilhas = await prisma.planilha.findMany({
            where: {
              OR: [
                { ano: { gt: currentYear } },
                { ano: currentYear, mes: { in: monthNames.slice(currentMonthIndex + 1) } }
              ]
            }
          });

          for (const p of futurePlanilhas) {
             // Calcular nova data para o mês da planilha futura
             const pMonthIndex = monthMap[p.mes];
             const novaData = new Date(data);
             novaData.setFullYear(p.ano);
             novaData.setMonth(pMonthIndex);
             novaData.setHours(12, 0, 0, 0);

             // Verificar se já existe (opcional, mas bom para evitar duplicatas se o usuário clicar 2x)
             // Mas como é create, vamos assumir que ele quer criar.
             
             await prisma.registroFinanceiro.create({
                data: {
                  descricao,
                  valor,
                  data: novaData,
                  tipo: TipoRegistro.SAIDA_FIXA,
                  contaDigital,
                  recorrente: true,
                  ativo: true,
                  planilhaId: p.id,
                }
             });
          }
        }
      }
    }
  } catch (error) {
    console.error("Erro ao criar registro:", error);
    return;
  }

  revalidatePath(`/planilhas/${planilhaId}`);
  redirect(`/planilhas/${planilhaId}`);
}

export async function deleteRegistro(id: string, planilhaId: string) {
  try {
    await prisma.registroFinanceiro.delete({
      where: { id },
    });
    revalidatePath(`/planilhas/${planilhaId}`);
  } catch (error) {
    console.error("Erro ao excluir registro:", error);
  }
}

export async function getRegistro(id: string) {
  try {
    const registro = await prisma.registroFinanceiro.findUnique({
      where: { id },
    });
    return registro;
  } catch (error) {
    console.error("Erro ao buscar registro:", error);
    return null;
  }
}

export async function updateRegistro(formData: FormData) {
  const id = formData.get("id") as string;
  const planilhaId = formData.get("planilhaId") as string;
  const descricao = formData.get("description") as string;
  const valor = Number(formData.get("value"));
  const dateStr = formData.get("date") as string;
  const data = new Date(`${dateStr}T12:00:00Z`);
  const tipo = formData.get("tipo") as TipoRegistro;
  const contaDigital = formData.get("contaDigital") === "on";
  
  // Checkbox "Encerrar"
  const encerrar = formData.get("encerrar") === "on";

  if (!id || !planilhaId || !descricao || !valor || !data || !tipo) {
    return;
  }

  try {
    // Atualiza o registro atual
    const registroAtual = await prisma.registroFinanceiro.update({
      where: { id },
      data: {
        descricao,
        valor,
        data,
        tipo,
        contaDigital,
        // Se for fixa e pedir para encerrar, ativo = false
        ativo: encerrar ? false : undefined,
      },
    });

    // Se for variável parcelada e pedir para encerrar, deletar parcelas futuras
    if (encerrar && tipo === TipoRegistro.SAIDA_VARIAVEL && registroAtual.grupoId && registroAtual.parcelaAtual) {
      await prisma.registroFinanceiro.deleteMany({
        where: {
          grupoId: registroAtual.grupoId,
          parcelaAtual: { gt: registroAtual.parcelaAtual },
        },
      });
    }

  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
    return;
  }

  revalidatePath(`/planilhas/${planilhaId}`);
  redirect(`/planilhas/${planilhaId}`);
}
