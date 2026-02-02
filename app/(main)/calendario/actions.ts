"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEventsAction(start: Date, end: Date) {
  const events = await prisma.evento.findMany({
    where: {
      dataInicio: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      dataInicio: "asc",
    },
  });
  return events;
}

export async function createEventAction(formData: FormData) {
  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const dataStr = formData.get("data") as string; // YYYY-MM-DD
  const linksJson = formData.get("links") as string;

  if (!titulo || !dataStr) {
    throw new Error("Dados inválidos");
  }

  // Define o horário para meio-dia para evitar problemas de fuso horário na visualização simples
  const dataInicio = new Date(dataStr + "T12:00:00");

  await prisma.evento.create({
    data: {
      titulo,
      descricao: descricao || null,
      links: linksJson || "[]",
      dataInicio,
    },
  });

  revalidatePath("/calendario");
}

export async function updateEventAction(id: string, formData: FormData) {
  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const linksJson = formData.get("links") as string;

  await prisma.evento.update({
    where: { id },
    data: {
      titulo,
      descricao: descricao || null,
      links: linksJson || "[]",
    },
  });

  revalidatePath("/calendario");
}

export async function deleteEventAction(id: string) {
  await prisma.evento.delete({
    where: { id },
  });

  revalidatePath("/calendario");
}
