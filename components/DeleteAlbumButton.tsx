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

  const handleSubmit = async (formData: FormData) => {
    const confirmed = window.confirm(
      "TEM CERTEZA ABSOLUTA?\n\nIsso apagará o álbum e TODAS as mídias dentro dele permanentemente."
    );

    if (confirmed) {
      await deleteWithId();
    }
  };

  return (
    <form action={handleSubmit}>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-red-200 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        title="Apagar Álbum Inteiro"
      >
        <Trash2 size={16} className="mr-2" />
        Excluir Álbum
      </button>
    </form>
  );
}
