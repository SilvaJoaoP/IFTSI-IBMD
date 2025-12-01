import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { updateAlbumAction } from "../../actions";
import { BackButton } from "@/components/BackButton";
import { ImageInput } from "@/components/ImageInput";

export default async function PaginaEditarAlbum(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);
  if (!permissions.canManageMidia) {
    redirect("/midia");
  }

  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) redirect("/midia");

  const updateAlbumWithId = updateAlbumAction.bind(null, album.id);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <BackButton href={`/midia/${id}`} />
      <h1 className="text-2xl font-bold my-6">Editar Álbum</h1>

      <div className="bg-white p-6 rounded shadow">
        <form action={updateAlbumWithId} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              defaultValue={album.titulo}
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <ImageInput
            name="capaUrl"
            label="Imagem de Capa"
            defaultValue={album.capaUrl}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
