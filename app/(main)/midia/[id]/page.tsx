import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { BackButton } from "@/components/BackButton";
import { addMediaAction, deleteMediaAction } from "../actions";
import { redirect } from "next/navigation";
import { MediaForm } from "@/components/MediaForm";
import { MediaGallery } from "@/components/MediaGallery";
import Link from "next/link";

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <BackButton href="/midia" />
          <h1 className="text-3xl font-bold mt-3 text-gray-900">
            {album.titulo}
          </h1>
          <p className="text-gray-500 mt-1">
            {album.midias.length} mídias na galeria
          </p>
        </div>

        {permissions.canManageMidia && (
          <Link
            href={`/midia/${album.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            ✏️ Editar Capa/Nome
          </Link>
        )}
      </div>

      {permissions.canManageMidia && (
        <MediaForm albumId={album.id} action={addMediaAction} />
      )}

      {album.midias.length > 0 ? (
        <MediaGallery
          midias={album.midias}
          onDelete={permissions.canManageMidia ? handleDeleteMedia : undefined}
        />
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mt-6">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-900">Álbum Vazio</h3>
          <p className="text-gray-500">
            Adicione fotos ou vídeos para começar a galeria.
          </p>
        </div>
      )}
    </div>
  );
}
