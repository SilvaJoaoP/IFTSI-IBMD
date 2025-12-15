"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function checkPermission() {
  const session = await auth();
  if (!session?.user?.cargo) throw new Error("Não autorizado");

  const permissions = getPermissionsForRole(session.user.cargo as Role);
  if (!permissions.canManageDocumentos) {
    throw new Error("Sem permissão para gerenciar documentos");
  }
  return session;
}

export async function createFolderAction(formData: FormData) {
  await checkPermission();

  const name = formData.get("name") as string;

  if (!name) return { success: false, message: "Nome obrigatório" };

  await prisma.documentFolder.create({
    data: {
      name,
    },
  });

  revalidatePath("/arquivos");
  redirect("/arquivos");
}

export async function deleteFolderAction(folderId: string) {
  await checkPermission();

  await prisma.documentFile.deleteMany({
    where: { folderId },
  });

  await prisma.documentFolder.delete({
    where: { id: folderId },
  });

  revalidatePath("/arquivos");
  redirect("/arquivos");
}

export async function addFileAction(folderId: string, formData: FormData) {
  await checkPermission();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string; 

  let url = "";

  if (type === "LINK") {
    url = formData.get("url") as string;
  } else if (type === "PDF") {
    url = formData.get("fileDataUrl") as string;
  }

  if (!name || !url)
    return { success: false, message: "Nome e URL obrigatórios" };

  await prisma.documentFile.create({
    data: {
      name,
      url,
      folderId,
      type: type || "PDF",
    },
  });

  revalidatePath(`/arquivos/${folderId}`);
  revalidatePath("/arquivos");

  return { success: true, message: "Arquivo adicionado!" };
}

export async function deleteFileAction(fileId: string, folderId: string) {
  await checkPermission();

  await prisma.documentFile.delete({
    where: { id: fileId },
  });

  revalidatePath(`/arquivos/${folderId}`);
  revalidatePath("/arquivos");

  return { success: true, message: "Arquivo removido!" };
}
