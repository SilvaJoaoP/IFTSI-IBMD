"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Usuário não autenticado." };
  }

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) {
    return { error: "Por favor, preencha todos os campos." };
  }

  if (newPassword.length < 8) {
    return { error: "A senha deve ter no mínimo 8 caracteres." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "As senhas digitadas não coincidem." };
  }

  try {
    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { senha: hashedPassword },
    });

    revalidatePath("/perfil");
    return { success: "Senha atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return { error: "Ocorreu um erro ao atualizar a senha. Tente novamente." };
  }
}
