"use client";

import { Trash2 } from "lucide-react";
import { deleteFolderAction } from "@/app/(main)/arquivos/actions";

interface DeleteFolderButtonProps {
  folderId: string;
  folderName: string;
}

export function DeleteFolderButton({
  folderId,
  folderName,
}: DeleteFolderButtonProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Quer realmente excluir a pasta '${folderName}' e seus itens PERMANENTEMENTE?`,
    );

    if (confirmed) {
      await deleteFolderAction(folderId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-2 bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-sm font-bold px-4 py-2 rounded-xl transition-all"
    >
      <Trash2 size={18} />
      <span className="hidden md:inline">EXCLUIR PASTA</span>
    </button>
  );
}
