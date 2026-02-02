import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { createFolderAction } from "../actions";
import { BackButton } from "@/components/BackButton";
import { FolderPlus } from "lucide-react";

export default async function PaginaNovaPasta() {
  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);

  if (!permissions.canManageDocumentos) {
    redirect("/arquivos");
  }

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/arquivos" />
      </div>

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0b3566]/10 text-[#0b3566] rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FolderPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Criar Nova Pasta
          </h1>
          <p className="text-slate-500 mt-2">
            Organize os documentos da instituição em pastas seguras.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-slate-200/50">
          <form action={createFolderAction} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nome da Pasta
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                placeholder="Ex: Financeiro, Eventos 2024..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0b3566] hover:bg-[#092b52] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              CRIAR PASTA
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
