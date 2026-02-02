import { prisma } from "@/lib/prisma";
import { TipoRegistro } from "@prisma/client";

export const monthMap: { [key: string]: number } = {
  Janeiro: 0,
  Fevereiro: 1,
  Março: 2,
  Abril: 3,
  Maio: 4,
  Junho: 5,
  Julho: 6,
  Agosto: 7,
  Setembro: 8,
  Outubro: 9,
  Novembro: 10,
  Dezembro: 11,
};

export const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export async function copyFixedExpensesFromPreviousMonth(planilhaId: string, mes: string, ano: number) {
    const currentMonthIndex = monthMap[mes];
    if (currentMonthIndex === undefined) return;

    let prevMonthIndex = currentMonthIndex - 1;
    let prevYear = ano;

    if (prevMonthIndex < 0) {
      prevMonthIndex = 11;
      prevYear = ano - 1;
    }

    const prevMonthName = monthNames[prevMonthIndex];

    const prevPlanilha = await prisma.planilha.findFirst({
      where: { mes: prevMonthName, ano: prevYear },
      include: { registros: true },
    });

    if (prevPlanilha) {
      const fixasAtivas = prevPlanilha.registros.filter(
        (r) =>
          r.tipo === TipoRegistro.SAIDA_FIXA &&
          r.recorrente === true &&
          r.ativo === true
      );

      for (const fixa of fixasAtivas) {
        const novaData = new Date(fixa.data);
        novaData.setFullYear(ano);
        novaData.setMonth(currentMonthIndex);
        novaData.setHours(12, 0, 0, 0);

        await prisma.registroFinanceiro.create({
          data: {
            descricao: fixa.descricao,
            valor: fixa.valor,
            data: novaData,
            tipo: TipoRegistro.SAIDA_FIXA,
            contaDigital: fixa.contaDigital,
            recorrente: true,
            ativo: true,
            planilhaId: planilhaId,
          },
        });
      }
    }
}
