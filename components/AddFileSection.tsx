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
        className="flex items-center gap-2 bg-[#0b3566] hover:bg-[#092b52] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={18} className="text-white" />
        ADICIONAR ARQUIVO
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/50">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-slate-900">
                Adicionar Arquivo
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMode("select");
                }}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100/50 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {mode === "select" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setMode("upload")}
                    className="w-full flex items-center gap-5 p-5 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group hover:shadow-md"
                  >
                    <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">
                        Upload PDF
                      </div>
                      <div className="text-sm text-slate-500">
                        Selecione um arquivo do seu computador
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("link")}
                    className="w-full flex items-center gap-5 p-5 rounded-2xl border border-gray-200 hover:border-green-500 hover:bg-green-50/50 transition-all text-left group hover:shadow-md"
                  >
                    <div className="bg-green-100 p-4 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
                      <LinkIcon size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">
                        Link Externo
                      </div>
                      <div className="text-sm text-slate-500">
                        Cole um link (Google Drive, Dropbox, etc)
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {mode === "upload" && (
                <form
                  action={handleUpload}
                  className="space-y-6 animate-in slide-in-from-right-4 duration-300"
                >
                  <input type="hidden" name="type" value="PDF" />

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">
                      Nome do Arquivo
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Ex: Estatuto Social 2024"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">
                      Arquivo PDF
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50/50 hover:border-blue-400 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500">
                          <span className="font-bold">
                            Clique para selecionar
                          </span>
                        </p>
                        <p className="text-xs text-slate-400">PDF (MAX. 4MB)</p>
                      </div>
                      <input
                        name="file"
                        type="file"
                        required
                        accept="application/pdf"
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setMode("select")}
                      className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 text-sm font-bold text-white bg-[#0b3566] hover:bg-[#092b52] rounded-xl shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      {loading ? "Enviando..." : "Enviar PDF"}
                    </button>
                  </div>
                </form>
              )}

              {mode === "link" && (
                <form
                  action={handleUpload}
                  className="space-y-6 animate-in slide-in-from-right-4 duration-300"
                >
                  <input type="hidden" name="type" value="LINK" />

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">
                      Nome do Link
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Ex: Planilha de Custos"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">
                      URL
                    </label>
                    <input
                      name="url"
                      type="url"
                      required
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setMode("select")}
                      className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 text-sm font-bold text-white bg-[#0b3566] hover:bg-[#092b52] rounded-xl shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <LinkIcon size={18} />
                      )}
                      {loading ? "Salvando..." : "Salvar Link"}
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
