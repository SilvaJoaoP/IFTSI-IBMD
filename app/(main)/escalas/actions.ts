"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEscalasAction(start: Date, end: Date) {
  const session = await auth();
  if (!session?.user) return [];

  const isPastor = session.user.cargo === "PASTOR";

  const whereClause: any = {
    data: {
      gte: start,
      lte: end,
    },
  };

  if (!isPastor) {
    // Se não é pastor, vê apenas suas próprias escalas
    whereClause.items = {
      some: {
        usuarioId: session.user.id,
      },
    };
  }

  const escalas = await prisma.escala.findMany({
    where: whereClause,
    include: {
      items: {
        include: {
          usuario: {
            select: { id: true, nome: true },
          },
        },
      },
    },
    orderBy: {
      data: "asc",
    },
  });

  return escalas;
}

export async function getUsersSimpleAction() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      cargo: true,
    },
    orderBy: {
      nome: "asc",
    },
  });
  return users;
}

export async function createEscalaAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.cargo !== "PASTOR") {
    throw new Error("Não autorizado");
  }

  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const dataStr = formData.get("data") as string;
  const horario = (formData.get("horario") as string) || "12:00";
  const itemsJson = formData.get("items") as string;

  if (!titulo || !dataStr) {
    throw new Error("Dados inválidos");
  }

  const items: { usuarioId: string; funcao: string }[] = JSON.parse(
    itemsJson || "[]",
  );

  await prisma.escala.create({
    data: {
      titulo,
      descricao,
      data: new Date(`${dataStr}T${horario}:00`),
      items: {
        create: items.map((item) => ({
          usuarioId: item.usuarioId,
          funcao: item.funcao,
        })),
      },
    },
  });

  revalidatePath("/escalas");
}

export async function updateEscalaAction(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.cargo !== "PASTOR") {
    throw new Error("Não autorizado");
  }

  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const dataStr = formData.get("data") as string;
  const horario = (formData.get("horario") as string) || "12:00";
  const itemsJson = formData.get("items") as string;

  const items: { usuarioId: string; funcao: string }[] = JSON.parse(
    itemsJson || "[]",
  );

  // Transação para atualizar: deletar items antigos e criar novos é uma estratégia simples
  // Ou tentar atualizar. Delete + Create é mais fácil p/ lista inteira.
  await prisma.$transaction(async (tx) => {
    await tx.escalaItem.deleteMany({
      where: { escalaId: id },
    });

    await tx.escala.update({
      where: { id },
      data: {
        titulo,
        descricao,
        data: new Date(`${dataStr}T${horario}:00`),
        items: {
          create: items.map((item) => ({
            usuarioId: item.usuarioId,
            funcao: item.funcao,
          })),
        },
      },
    });
  });

  revalidatePath("/escalas");
}

export async function deleteEscalaAction(id: string) {
  const session = await auth();
  if (session?.user?.cargo !== "PASTOR") {
    throw new Error("Não autorizado");
  }

  await prisma.escala.delete({
    where: { id },
  });

  revalidatePath("/escalas");
}
