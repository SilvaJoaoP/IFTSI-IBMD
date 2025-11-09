"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 *
 * @param formData Dados recebidos do formulário
 */
export async function createMembro(formData: FormData) {
  try {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;

    if (!nome || !email) {
      throw new Error("Nome e E-mail são obrigatórios.");
    }

    await prisma.membro.create({
      data: {
        nome: nome,
        email: email,
      },
    });

    revalidatePath("/membros");

    return { success: true, message: "Membro criado com sucesso." };
  } catch (error) {
    return { success: false, message: "Erro ao criar membro." };
  }
}

/**
 *
 * @param id O ID do membro a ser deletado
 */
export async function deleteMembro(id: string) {
  try {
    if (!id) {
      throw new Error("ID do membro é necessário.");
    }

    await prisma.membro.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/membros");
    return { success: true, message: "Membro deletado com sucesso." };
  } catch (error) {
    return { success: false, message: "Erro ao deletar membro." };
  }
}
