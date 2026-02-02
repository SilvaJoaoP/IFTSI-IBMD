import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { Folder, Search, FileText } from "lucide-react";

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
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Documentos
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie arquivos, atas e documentos oficiais.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Visual Search Placeholder if needed for consistency 
          <div className="relative w-full md:w-72 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar pastas..."
              disabled
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-full w-full bg-slate-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          */}

          {permissions.canManageDocumentos && (
            <Link
              href="/arquivos/novo"
              className="bg-[#0b3566] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#072646] transition-all shadow-md hover:shadow-lg font-medium whitespace-nowrap active:scale-95 duration-200"
            >
              <span className="text-xl leading-none font-light">+</span> Nova
              Pasta
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/arquivos/${folder.id}`}
            className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-between min-h-[160px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <Folder className="w-7 h-7 fill-current" />
            </div>

            <div className="w-full">
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0b3566] transition-colors truncate">
                {folder.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
                <span className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 group-hover:border-slate-200">
                  {folder._count.files} itens
                </span>
              </div>
            </div>

            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </Link>
        ))}

        {folders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileText size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Sem pastas por enquanto
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Crie uma nova pasta para começar a organizar os documentos da
              igreja.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
