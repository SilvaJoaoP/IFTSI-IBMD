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
      `Quer realmente excluir a pasta '${folderName}' e seus itens PERMANENTEMENTE?`
    );

    if (confirmed) {
      await deleteFolderAction(folderId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 flex items-center gap-2 bg-white px-4 py-2 rounded border border-red-200 shadow-sm"
    >
      <Trash2 size={20} /> Excluir Pasta
    </button>
  );
}
