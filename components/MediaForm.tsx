"use client";

import { ImageInput } from "./ImageInput";
import { useState } from "react";
import { Plus } from "lucide-react";

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
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <Plus size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Adicionar Nova Mídia
          </h3>
          <p className="text-sm text-slate-500">
            Faça upload ou cole um link do Google Drive
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <ImageInput
          key={resetKey}
          name="url"
          label="Arquivo ou Link"
          required
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full sm:w-auto bg-[#0b3566] text-white px-8 py-3 rounded-xl hover:bg-blue-900 font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>Enviando...</>
            ) : (
              <>
                <Plus size={20} />
                Adicionar à Galeria
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
