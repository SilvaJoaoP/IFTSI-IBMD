import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { BackButton } from "@/components/BackButton";
import { redirect } from "next/navigation";
import { deleteFileAction } from "../actions";
import { AddFileSection } from "@/components/AddFileSection";
import { DeleteFolderButton } from "@/components/DeleteFolderButton";
import { FileIcon, Trash2 } from "lucide-react";

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
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <BackButton href="/arquivos" />
          <h1 className="text-3xl font-bold mt-3 text-gray-900">
            {folder.name}
          </h1>
          <p className="text-gray-500 mt-1">{folder.files.length} arquivos</p>
        </div>

        {permissions.canManageDocumentos && (
          <DeleteFolderButton folderId={folder.id} folderName={folder.name} />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
          <div className="col-span-6">NOME DO DOCUMENTO</div>
          <div className="col-span-2">TIPO</div>
          <div className="col-span-4 flex justify-between items-center">
            <span>DATA DE MODIFICAÇÃO</span>
            {permissions.canManageDocumentos && (
              <AddFileSection folderId={id} />
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {folder.files.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition"
            >
              <div className="col-span-6 flex items-center gap-3">
                <FileIcon className="text-red-500" size={20} />
                <a
                  href={
                    file.type === "PDF" ? `/api/files/${file.id}` : file.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:underline truncate"
                >
                  {file.name}
                </a>
              </div>
              <div className="col-span-2 text-sm text-gray-500">
                {file.type}
              </div>
              <div className="col-span-4 flex justify-between items-center text-sm text-gray-500">
                <span>{file.updatedAt.toLocaleDateString("pt-BR")}</span>
                {permissions.canManageDocumentos && (
                  <form action={handleDeleteFile.bind(null, file.id)}>
                    <button
                      type="submit"
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}

          {folder.files.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum arquivo nesta pasta.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
