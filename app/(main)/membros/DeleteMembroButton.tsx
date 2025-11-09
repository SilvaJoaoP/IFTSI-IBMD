"use client";

import { deleteMembro } from "./actions";
import { useTransition } from "react";

interface DeleteButtonProps {
  id: string;
}

export function DeleteMembroButton({ id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    if (confirm("Tem certeza que deseja deletar este membro?")) {
      startTransition(async () => {
        const result = await deleteMembro(id);
        if (!result.success) {
          alert(result.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400"
    >
      {isPending ? "Deletando..." : "Deletar"}
    </button>
  );
}
