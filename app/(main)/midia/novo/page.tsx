// app/(main)/midia/novo/page.tsx
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { createAlbumAction } from "../actions";
import { BackButton } from "@/components/BackButton";
import { ImageInput } from "@/components/ImageInput";
import { FolderPlus, Save } from "lucide-react";

export default async function PaginaNovoAlbum() {
  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);

  if (!permissions.canManageMidia) {
    redirect("/midia");
  }

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/midia" />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0b3566]/10 text-[#0b3566] rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FolderPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Criar Novo Átbum
          </h1>
          <p className="text-slate-500 mt-2">
            Crie uma nova coleção para organizar suas fotos e vídeos.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-slate-200/50">
          <form action={createAlbumAction} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Título do Álbum
              </label>
              <input
                type="text"
                name="titulo"
                required
                placeholder="Ex: Culto de Jovens - Jan/2026"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <ImageInput name="capaUrl" label="Imagem de Capa (Opcional)" />

            <button
              type="submit"
              className="w-full bg-[#0b3566] hover:bg-[#092b52] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save size={20} />
              CRIAR ÁLBUM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
