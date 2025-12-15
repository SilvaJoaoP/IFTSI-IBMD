import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import Image from "next/image";
import { Folder } from "lucide-react";

export default async function PaginaArquivos() {
  const session = await auth();
  const role = session?.user?.cargo as Role;
  const permissions = getPermissionsForRole(role);
  const user = session?.user;

  const folders = await prisma.documentFolder.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { files: true } } },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 font-sans text-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <BackButton href="/dashboard" />
        </div>

        {/* Header */}
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col items-center">
            <Image
              src="/logoSemFundo.png"
              alt="Logo"
              width={130}
              height={45}
              priority
              className="object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800">
                {user?.nome || "Usuário"}
              </p>
              <p className="text-[10px] text-gray-500">
                {user?.cargo || "Cargo"}
              </p>
            </div>
            <Link
              href="/perfil"
              className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-sm flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition"
            >
              {/* Placeholder avatar or user image if available */}
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-lg">
                {user?.nome?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Documentos</h1>
          {permissions.canManageDocumentos && (
            <Link
              href="/arquivos/novo"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span> NOVO
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/arquivos/${folder.id}`}
              className="block group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition p-6 flex flex-col items-center justify-center border border-gray-100"
            >
              <Folder
                className="w-16 h-16 text-yellow-500 mb-4"
                fill="currentColor"
              />
              <h2 className="text-xl font-bold text-gray-800 text-center">
                {folder.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {folder._count.files} arquivos
              </p>
            </Link>
          ))}

          {folders.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                Não há pasta de arquivos criada ainda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
