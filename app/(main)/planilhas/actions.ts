"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TipoRegistro } from "@prisma/client";
import { copyFixedExpensesFromPreviousMonth, monthMap, monthNames } from "@/lib/finance";

export async function getPlanilhas() {
  try {
    const planilhas = await prisma.planilha.findMany({
      orderBy: [{ ano: "desc" }, { createdAt: "desc" }],
    });
    return planilhas;
  } catch (error) {
    console.error("Erro ao buscar planilhas:", error);
    return [];
  }
}

export async function createPlanilha(formData: FormData) {
  const mes = formData.get("month") as string;
  const ano = Number(formData.get("year"));

  if (!mes || !ano) {
    return { error: "Mês e ano são obrigatórios." };
  }

  try {
    const existing = await prisma.planilha.findFirst({
      where: { mes, ano },
    });

    if (existing) {
      return { error: "Já existe uma planilha para este mês e ano." };
    }

    const novaPlanilha = await prisma.planilha.create({
      data: {
        mes,
        ano,
      },
    });

    // Lógica para copiar saídas fixas do mês anterior
    await copyFixedExpensesFromPreviousMonth(novaPlanilha.id, mes, ano);

  } catch (error) {
    console.error("Erro ao criar planilha:", error);
    return { error: "Não foi possível criar a planilha." };
  }

  revalidatePath("/planilhas");
  redirect("/planilhas");
}

export async function deletePlanilha(id: string) {
    try {
        await prisma.planilha.delete({
            where: { id },
        });
        revalidatePath("/planilhas");
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar planilha:", error);
        return { error: "Não foi possível deletar a planilha." };
    }
}

export async function renamePlanilha(id: string, novoMes: string, novoAno: number) {
  try {
    await prisma.planilha.update({
      where: { id },
      data: { mes: novoMes, ano: novoAno },
    });
    revalidatePath("/planilhas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao renomear planilha:", error);
    return { error: "Não foi possível renomear a planilha." };
  }
}
