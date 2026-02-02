"use client";

import { Trash2 } from "lucide-react";

interface DeleteAlbumButtonProps {
  albumId: string;
  deleteAction: (id: string) => Promise<void>;
}

export function DeleteAlbumButton({
  albumId,
  deleteAction,
}: DeleteAlbumButtonProps) {
  const deleteWithId = deleteAction.bind(null, albumId);

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      "TEM CERTEZA ABSOLUTA?\n\nIsso apagará o álbum e TODAS as mídias dentro dele permanentemente.",
    );

    if (confirmed) {
      await deleteWithId();
    }
  };

  return (
    <form action={handleSubmit}>
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-100/80 hover:border-red-300 transition-all shadow-sm group"
        title="Apagar Álbum Inteiro"
      >
        <Trash2
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="hidden sm:inline">Excluir Álbum</span>
      </button>
    </form>
  );
}
