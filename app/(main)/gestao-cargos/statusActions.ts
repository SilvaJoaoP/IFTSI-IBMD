"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserStatusAction(
  userId: string,
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED",
  suspendedUntil?: Date,
) {
  const session = await auth();
  if (session?.user?.cargo !== Role.PASTOR) {
    return { success: false, message: "Não autorizado" };
  }

  // Prevent self-lockout if needed, but maybe Pastor wants to test it?
  // Probably shouldn't suspend themselves.
  if (session.user.id === userId) {
    return {
      success: false,
      message: "Não é possível alterar o próprio status.",
    };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        suspendedUntil: suspendedUntil || null,
      },
    });
    revalidatePath("/gestao-cargos");
    return { success: true, message: "Status atualizado com sucesso." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao atualizar status." };
  }
}
