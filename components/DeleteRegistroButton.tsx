"use client";

import { Trash2 } from "lucide-react";
import { deleteRegistro } from "@/app/(main)/planilhas/[id]/actions";

interface DeleteRegistroButtonProps {
  id: string;
  planilhaId: string;
}

export function DeleteRegistroButton({ id, planilhaId }: DeleteRegistroButtonProps) {
  return (
    <button
      onClick={async () => {
        if (confirm("Tem certeza que deseja excluir este registro?")) {
          await deleteRegistro(id, planilhaId);
        }
      }}
      className="text-red-500 hover:text-red-700 p-1"
      title="Excluir"
    >
      <Trash2 size={18} />
    </button>
  );
}
