import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { BackButton } from "@/components/BackButton";
import { DeleteAlbumButton } from "@/components/DeleteAlbumButton";
import {
  addMediaAction,
  deleteMediaAction,
  deleteAlbumAction,
} from "../actions";
import { redirect } from "next/navigation";
import { MediaForm } from "@/components/MediaForm";
import { MediaGallery } from "@/components/MediaGallery";
import Link from "next/link";
import { Edit, Image as ImageIcon } from "lucide-react";

export default async function PaginaDetalhesAlbum(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);

  const album = await prisma.album.findUnique({
    where: { id },
    include: { midias: { orderBy: { createdAt: "desc" } } },
  });

  if (!album) redirect("/midia");

  async function handleDeleteMedia(mediaId: string) {
    "use server";
    if (!permissions.canManageMidia) return;
    await deleteMediaAction(mediaId, id);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="flex gap-4">
            <div className="mt-1">
              <BackButton href="/midia" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0b3566]">
                  <ImageIcon size={24} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {album.titulo}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium ml-1">
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs">
                  Álbum
                </span>
                <span>•</span>
                <span>{album.midias.length} itens na galeria</span>
              </div>
            </div>
          </div>

          {permissions.canManageMidia && (
            <div className="flex items-center gap-3">
              <Link
                href={`/midia/${album.id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
              >
                <Edit
                  size={18}
                  className="text-slate-400 group-hover:text-[#0b3566] transition-colors"
                />
                Editar Álbum
              </Link>

              <div className="h-8 w-px bg-slate-300 mx-1" />

              <DeleteAlbumButton
                albumId={album.id}
                deleteAction={deleteAlbumAction}
              />
            </div>
          )}
        </div>

        {permissions.canManageMidia && (
          <MediaForm albumId={album.id} action={addMediaAction} />
        )}

        <MediaGallery
          midias={album.midias}
          onDelete={permissions.canManageMidia ? handleDeleteMedia : undefined}
        />
      </div>
    </div>
  );
}
