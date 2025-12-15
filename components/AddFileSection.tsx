"use client";

import { useState } from "react";
import { Plus, Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";
import { addFileAction } from "@/app/(main)/arquivos/actions";
import { useRouter } from "next/navigation";

export function AddFileSection({ folderId }: { folderId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"select" | "upload" | "link">("select");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  async function handleUpload(formData: FormData) {
    setLoading(true);
    try {
      const type = formData.get("type") as string;

      if (type === "PDF") {
        const file = formData.get("file") as File;
        if (file && file.size > 0) {
          if (file.size > 4 * 1024 * 1024) {
            alert("Arquivo muito grande. O limite é 4MB.");
            setLoading(false);
            return;
          }
          const dataUrl = await toBase64(file);
          formData.set("fileDataUrl", dataUrl);
          formData.delete("file");
        }
      }

      const result = await addFileAction(folderId, formData);

      if (!result?.success) {
        alert(result?.message || "Erro ao salvar arquivo.");
        return;
      }

      setIsOpen(false);
      setMode("select");
      router.refresh();
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro inesperado ao adicionar arquivo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
      >
        <Plus size={16} />
        ADICIONAR
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Adicionar Arquivo</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMode("select");
                }}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {mode === "select" && (
                <div className="space-y-3">
                  <button
                    onClick={() => setMode("upload")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-left group"
                  >
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200 transition">
                      <Upload size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Upload PDF
                      </div>
                      <div className="text-sm text-gray-500">
                        Do seu computador
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("link")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition text-left group"
                  >
                    <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-200 transition">
                      <LinkIcon size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Link Externo
                      </div>
                      <div className="text-sm text-gray-500">
                        Google Drive, Dropbox, etc.
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {mode === "upload" && (
                <form action={handleUpload} className="space-y-4">
                  <input type="hidden" name="type" value="PDF" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Arquivo
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ex: Relatório 2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arquivo PDF
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept="application/pdf"
                      required
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setMode("select")}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition shadow-sm"
                    >
                      {loading && (
                        <Loader2 className="animate-spin" size={16} />
                      )}
                      Salvar
                    </button>
                  </div>
                </form>
              )}

              {mode === "link" && (
                <form action={handleUpload} className="space-y-4">
                  <input type="hidden" name="type" value="LINK" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Arquivo
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ex: Planilha Drive"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL do Link
                    </label>
                    <input
                      name="url"
                      type="url"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setMode("select")}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition shadow-sm"
                    >
                      {loading && (
                        <Loader2 className="animate-spin" size={16} />
                      )}
                      Salvar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
