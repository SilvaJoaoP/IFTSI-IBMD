// app/(main)/midia/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

export default async function PaginaGaleria() {
  const session = await auth();
  const role = session?.user?.cargo as Role;
  const permissions = getPermissionsForRole(role);

  // Buscar álbuns
  const albuns = await prisma.album.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { midias: true } } },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <BackButton href="/dashboard" />
          <h1 className="text-3xl font-bold mt-2">Galeria de Mídia</h1>
        </div>

        {permissions.canManageMidia && (
          <Link
            href="/midia/novo"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
          >
            + NOVO ÁLBUM
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albuns.map((album) => (
          <Link
            key={album.id}
            href={`/midia/${album.id}`}
            className="block group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="h-48 bg-gray-800 w-full relative">
              {album.capaUrl ? (
                <img
                  src={album.capaUrl}
                  alt={album.titulo}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">
                  <span className="text-4xl">📷</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h2 className="text-xl font-bold drop-shadow-md leading-tight">
                  {album.titulo}
                </h2>
                <p className="text-sm opacity-90 drop-shadow-md mt-1">
                  {album._count.midias} itens
                </p>
              </div>
            </div>
          </Link>
        ))}

        {albuns.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Nenhum álbum criado ainda.</p>
            {permissions.canManageMidia && (
              <p className="text-sm text-gray-400 mt-2">
                Clique em "+ NOVO ÁLBUM" para começar.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
