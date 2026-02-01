import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { BackButton } from "@/components/BackButton";
import { redirect } from "next/navigation";
import { deleteFileAction } from "../actions";
import { AddFileSection } from "@/components/AddFileSection";
import { DeleteFolderButton } from "@/components/DeleteFolderButton";
import {
  FileText,
  Trash2,
  Calendar,
  File as FileIconGeneric,
} from "lucide-react";

export default async function PaginaDetalhesPasta(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const session = await auth();
  const permissions = getPermissionsForRole(session?.user?.cargo as Role);

  const folder = await prisma.documentFolder.findUnique({
    where: { id },
    include: { files: { orderBy: { createdAt: "desc" } } },
  });

  if (!folder) redirect("/arquivos");

  async function handleDeleteFile(fileId: string) {
    "use server";
    if (!permissions.canManageDocumentos) return;
    await deleteFileAction(fileId, id);
  }

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton href="/arquivos" />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {folder.name}
            </h1>
            <p className="text-slate-500 mt-1">
              {folder.files.length} arquivos disponíveis
            </p>
          </div>
        </div>

        {permissions.canManageDocumentos && (
          <div className="flex gap-3">
            <DeleteFolderButton folderId={folder.id} folderName={folder.name} />
            <AddFileSection folderId={id} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {folder.files.length > 0 && (
          <div className="hidden md:grid grid-cols-12 gap-6 p-6 bg-slate-50/50 border-b border-gray-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-6">Arquivo</div>
            <div className="col-span-3">Tipo</div>
            <div className="col-span-3 text-right">Ações</div>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {folder.files.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50/50 transition-colors group"
            >
              <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    file.type === "PDF"
                      ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {file.type === "PDF" ? (
                    <FileText size={20} />
                  ) : (
                    <FileIconGeneric size={20} />
                  )}
                </div>
                <div className="min-w-0">
                  <a
                    href={
                      file.type === "PDF" ? `/api/files/${file.id}` : file.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-900 hover:text-[#0b3566] hover:underline truncate block text-lg md:text-base leading-tight md:leading-normal"
                  >
                    {file.name}
                  </a>
                  <span className="md:hidden text-xs text-slate-500 font-medium mt-1 inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {file.updatedAt.toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-3 hidden md:flex items-center text-sm font-medium text-slate-500">
                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                  {file.type}
                </span>
              </div>

              <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center gap-4 text-sm text-slate-500">
                <span className="hidden md:inline font-mono text-xs">
                  {file.updatedAt.toLocaleDateString("pt-BR")}
                </span>

                {permissions.canManageDocumentos && (
                  <form action={handleDeleteFile.bind(null, file.id)}>
                    <button
                      type="submit"
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir arquivo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}

          {folder.files.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                <FileText size={32} />
              </div>
              <p className="text-slate-900 font-bold mb-1">
                Esta pasta está vazia
              </p>
              <p className="text-slate-500 text-sm">
                Adicione documentos para começar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
