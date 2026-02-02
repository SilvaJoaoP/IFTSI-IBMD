"use client";

import { Trash2 } from "lucide-react";
import { deleteRegistro } from "@/app/(main)/planilhas/[id]/actions";

interface DeleteRegistroButtonProps {
  id: string;
  planilhaId: string;
}

export function DeleteRegistroButton({
  id,
  planilhaId,
}: DeleteRegistroButtonProps) {
  return (
    <button
      onClick={async () => {
        if (confirm("Tem certeza que deseja excluir este registro?")) {
          await deleteRegistro(id, planilhaId);
        }
      }}
      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
      title="Excluir"
    >
      <Trash2 size={18} />
    </button>
  );
}
