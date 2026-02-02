// app/(main)/midia/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { FolderPlus, Image as ImageIcon, Video, Layers } from "lucide-react";

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
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Galeria de Mídia
          </h1>
          <p className="text-slate-500 mt-2">
            Fotos e vídeos dos eventos e atividades.
          </p>
        </div>

        {permissions.canManageMidia && (
          <Link
            href="/midia/novo"
            className="flex items-center gap-2 bg-[#0b3566] hover:bg-[#092b52] text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FolderPlus size={20} />
            NOVO ÁLBUM
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albuns.map((album) => (
          <Link
            key={album.id}
            href={`/midia/${album.id}`}
            className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[4/3] bg-slate-100 w-full relative overflow-hidden">
              {album.capaUrl ? (
                <img
                  src={album.capaUrl}
                  alt={album.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-200 bg-slate-50 relative">
                  <ImageIcon size={64} strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium text-sm">
                  Visualizar Galeria
                </p>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0b3566] transition-colors line-clamp-1 mb-2">
                {album.titulo}
              </h2>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
                  <Layers size={14} className="text-slate-400" />
                  {album._count.midias} ITENS
                </div>
                <span className="text-slate-300">•</span>
                <span>
                  {new Date(album.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {albuns.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Nenhum álbum encontrado
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              A galeria está vazia no momento. Crie um novo álbum para começar a
              adicionar fotos e vídeos.
            </p>
            {permissions.canManageMidia && (
              <Link
                href="/midia/novo"
                className="inline-flex items-center gap-2 text-[#0b3566] font-bold hover:underline"
              >
                Criar primeiro álbum
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
