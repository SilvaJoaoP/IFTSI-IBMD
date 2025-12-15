"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SituacaoMembro, TipoParentesco } from "@prisma/client";

export async function getMembros() {
  try {
    const membros = await prisma.membro.findMany({
      orderBy: { nome: "asc" },
      include: {
        parentesOrigem: {
          include: {
            membroDestino: true,
          },
        },
        parentesDestino: {
          include: {
            membroOrigem: true,
          },
        },
      },
    });
    return { success: true, data: membros };
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return { success: false, error: "Erro ao buscar membros." };
  }
}

export async function createMembro(formData: FormData) {
  try {
    const nome = formData.get("nome") as string;
    const cpf = formData.get("cpf") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;

    const rua = formData.get("rua") as string;
    const numero = formData.get("numero") as string;
    const bairro = formData.get("bairro") as string;
    const cidade = formData.get("cidade") as string;
    const estado = formData.get("estado") as string;

    const situacao = formData.get("situacao") as SituacaoMembro;

    const parenteId = formData.get("parenteId") as string;
    const tipoParentesco = formData.get("tipoParentesco") as TipoParentesco;

    if (!nome) {
      return { success: false, message: "Nome é obrigatório." };
    }

    const novoMembro = await prisma.membro.create({
      data: {
        nome,
        cpf,
        email,
        telefone,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        situacao: situacao || "MEMBRO",
      },
    });

    if (parenteId && tipoParentesco) {
      await prisma.parentesco.create({
        data: {
          membroOrigemId: novoMembro.id,
          membroDestinoId: parenteId,
          tipo: tipoParentesco,
        },
      });
    }

    revalidatePath("/membros");
    return { success: true, message: "Membro criado com sucesso." };
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return { success: false, message: "Erro ao criar membro." };
  }
}

export async function updateMembro(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const nome = formData.get("nome") as string;
    const cpf = formData.get("cpf") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;

    const rua = formData.get("rua") as string;
    const numero = formData.get("numero") as string;
    const bairro = formData.get("bairro") as string;
    const cidade = formData.get("cidade") as string;
    const estado = formData.get("estado") as string;

    const situacao = formData.get("situacao") as SituacaoMembro;

    if (!id || !nome) {
      return { success: false, message: "ID e Nome são obrigatórios." };
    }

    await prisma.membro.update({
      where: { id },
      data: {
        nome,
        cpf,
        email,
        telefone,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        situacao,
      },
    });

    const parenteId = formData.get("parenteId") as string;
    const tipoParentesco = formData.get("tipoParentesco") as TipoParentesco;

    if (parenteId && tipoParentesco) {
      const existe = await prisma.parentesco.findFirst({
        where: {
          membroOrigemId: id,
          membroDestinoId: parenteId,
        },
      });

      if (!existe) {
        await prisma.parentesco.create({
          data: {
            membroOrigemId: id,
            membroDestinoId: parenteId,
            tipo: tipoParentesco,
          },
        });
      }
    }

    revalidatePath("/membros");
    return { success: true, message: "Membro atualizado com sucesso." };
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    return { success: false, message: "Erro ao atualizar membro." };
  }
}

export async function deleteParentesco(id: string) {
  try {
    await prisma.parentesco.delete({
      where: { id },
    });
    revalidatePath("/membros");
    return { success: true, message: "Vínculo removido." };
  } catch (error) {
    return { success: false, message: "Erro ao remover vínculo." };
  }
}

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

export async function addParentesco(
  origemId: string,
  destinoId: string,
  tipo: TipoParentesco
) {
  try {
    await prisma.parentesco.create({
      data: {
        membroOrigemId: origemId,
        membroDestinoId: destinoId,
        tipo: tipo,
      },
    });
    revalidatePath("/membros");
    return { success: true, message: "Vínculo adicionado." };
  } catch (error) {
    return { success: false, message: "Erro ao adicionar vínculo." };
  }
}
