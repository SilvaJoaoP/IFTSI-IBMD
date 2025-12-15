import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { createFolderAction } from "../actions";
import { BackButton } from "@/components/BackButton";

export default async function PaginaNovaPasta() {
  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);

  if (!permissions.canManageDocumentos) {
    redirect("/arquivos");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <BackButton href="/arquivos" />
      <h1 className="text-2xl font-bold my-6">Criar Nova Pasta</h1>

      <div className="bg-white p-6 rounded shadow">
        <form action={createFolderAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome da Pasta
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border p-2 rounded mt-1"
              placeholder="Ex: Financeiro, Eventos..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Criar Pasta
          </button>
        </form>
      </div>
    </div>
  );
}
