"use client";

import { ImageInput } from "./ImageInput";
import { useState } from "react";

interface MediaFormProps {
  albumId: string;
  action: (albumId: string, formData: FormData) => Promise<any>;
}

export function MediaForm({ albumId, action }: MediaFormProps) {
  const [resetKey, setResetKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const boundAction = action.bind(null, albumId);

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    try {
      await boundAction(formData);
      setResetKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar mídia. Verifique o tamanho do arquivo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100 shadow-sm">
      <h3 className="font-semibold text-blue-800 mb-4 text-lg">
        Adicionar Mídia ao Álbum
      </h3>

      <form action={handleSubmit} className="space-y-4">
        {/* O ImageInput agora envia 'url' E 'tipo' automaticamente */}
        <ImageInput
          key={resetKey}
          name="url"
          label="Selecione a Imagem ou Vídeo"
          required
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Enviando..." : "Adicionar Mídia"}
          </button>
        </div>
      </form>
    </div>
  );
}
