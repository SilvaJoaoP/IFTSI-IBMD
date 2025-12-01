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
  if (!permissions.canManageMidia) {
    throw new Error("Sem permissão para gerenciar mídia");
  }
  return session;
}

export async function createAlbumAction(formData: FormData) {
  await checkPermission();

  const titulo = formData.get("titulo") as string;
  const capaUrl = formData.get("capaUrl") as string;

  if (!titulo) return { success: false, message: "Título obrigatório" };

  await prisma.album.create({
    data: {
      titulo,
      capaUrl: capaUrl || null,
    },
  });

  revalidatePath("/midia");
  redirect("/midia");
}

export async function updateAlbumAction(id: string, formData: FormData) {
  await checkPermission();

  const titulo = formData.get("titulo") as string;
  const capaUrl = formData.get("capaUrl") as string;

  if (!titulo) return { success: false, message: "Título obrigatório" };

  await prisma.album.update({
    where: { id },
    data: {
      titulo,
      capaUrl: capaUrl || null,
    },
  });

  revalidatePath("/midia");
  revalidatePath(`/midia/${id}`);
  redirect(`/midia/${id}`);
}

export async function addMediaAction(albumId: string, formData: FormData) {
  await checkPermission();

  const url = formData.get("url") as string;
  const tipo = formData.get("tipo") as string;

  if (!url) return { success: false, message: "URL obrigatória" };

  await prisma.midia.create({
    data: {
      url,
      tipo,
      albumId,
    },
  });

  revalidatePath(`/midia/${albumId}`);
  revalidatePath("/midia");

  return { success: true, message: "Mídia adicionada!" };
}

export async function deleteMediaAction(mediaId: string, albumId: string) {
  await checkPermission();

  await prisma.midia.delete({
    where: { id: mediaId },
  });

  revalidatePath(`/midia/${albumId}`);
  revalidatePath("/midia");

  return { success: true, message: "Mídia removida!" };
}

export async function deleteAlbumAction(albumId: string) {
  await checkPermission();

  await prisma.album.delete({
    where: { id: albumId },
  });

  revalidatePath("/midia");
  redirect("/midia");
}
