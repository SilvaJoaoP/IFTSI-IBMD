// app/(main)/midia/novo/page.tsx
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { createAlbumAction } from "../actions";
import { BackButton } from "@/components/BackButton";
import { ImageInput } from "@/components/ImageInput";

export default async function PaginaNovoAlbum() {
  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);

  if (!permissions.canManageMidia) {
    redirect("/midia");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <BackButton href="/midia" />
      <h1 className="text-2xl font-bold my-6">Criar Novo Álbum</h1>

      <div className="bg-white p-6 rounded shadow">
        <form action={createAlbumAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título do Álbum
            </label>
            <input
              type="text"
              name="titulo"
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <ImageInput name="capaUrl" label="Imagem de Capa (Opcional)" />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Criar Álbum
          </button>
        </form>
      </div>
    </div>
  );
}
