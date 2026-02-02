"use client";

import { Trash2 } from "lucide-react";
import { deletePlanilha } from "@/app/(main)/planilhas/actions";

interface DeletePlanilhaButtonProps {
  id: string;
  mes: string;
  ano: number;
}

export function DeletePlanilhaButton({ id, mes, ano }: DeletePlanilhaButtonProps) {
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent triggering the parent Link
        if (confirm(`Tem certeza que deseja excluir a planilha de ${mes}/${ano}?`)) {
          await deletePlanilha(id);
        }
      }}
      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm mt-4"
      title="Excluir Planilha"
    >
      <Trash2 size={16} />
      Excluir
    </button>
  );
}
