"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ImageInputProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}

export function ImageInput({
  name,
  label,
  defaultValue,
  required,
}: ImageInputProps) {
  const [method, setMethod] = useState<"LINK" | "FILE">("LINK");
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");

  const [detectedType, setDetectedType] = useState<"IMAGEM" | "VIDEO">(
    "IMAGEM",
  );

  const [isCheckingDrive, setIsCheckingDrive] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const getDriveId = (url: string) => {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return idMatch ? idMatch[1] : null;
  };

  const isDriveLink = (url: string) =>
    url.includes("drive.google.com") || url.includes("docs.google.com");

  const checkDriveLinkType = async (url: string) => {
    const id = getDriveId(url);
    if (!id) return;

    setIsCheckingDrive(true);

    const directImageUrl = `https://drive.google.com/uc?export=view&id=${id}`;

    return new Promise<void>((resolve) => {
      const img = new Image();

      img.onload = () => {
        // SUCESSO: É realmente uma imagem
        setDetectedType("IMAGEM");
        setInputValue(directImageUrl);
        setPreview(directImageUrl);
        setIsCheckingDrive(false);
        resolve();
      };

      img.onerror = () => {
        setDetectedType("VIDEO");
        setInputValue(url);

        setPreview(`https://drive.google.com/thumbnail?id=${id}&sz=w800`);

        setIsCheckingDrive(false);
        resolve();
      };

      img.src = directImageUrl;
    });
  };

  const handleLinkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setInputValue(val);
    setPreview(val);

    if (!val) {
      setIsCheckingDrive(false);
      return;
    }

    if (val.match(/\.(mp4|webm|ogg|mov|mkv)$/i)) {
      setDetectedType("VIDEO");
      return;
    }
    if (val.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      setDetectedType("IMAGEM");
      return;
    }

    if (isDriveLink(val)) {
      const timeoutId = setTimeout(() => {
        checkDriveLinkType(val);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert(
          "Arquivo muito grande (Max 50MB). Use Link Externo para arquivos maiores.",
        );
        e.target.value = "";
        return;
      }
      setIsProcessingFile(true);
      try {
        const base64 = await toBase64(file);
        setInputValue(base64);
        setPreview(base64);

        if (file.type.startsWith("video/")) {
          setDetectedType("VIDEO");
        } else {
          setDetectedType("IMAGEM");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao ler arquivo");
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-slate-700">{label}</label>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMethod("LINK")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              method === "LINK"
                ? "bg-white text-[#0b3566] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            LINK
          </button>
          <button
            type="button"
            onClick={() => setMethod("FILE")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              method === "FILE"
                ? "bg-white text-[#0b3566] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            UPLOAD
          </button>
        </div>
      </div>

      <input type="hidden" name={name} value={inputValue} />
      <input type="hidden" name="mediaType" value={detectedType} />

      {method === "LINK" && (
        <div className="relative">
          <div className="flex items-center gap-2 absolute left-4 top-3.5 text-slate-400 pointer-events-none">
            {isCheckingDrive ? (
              <Loader2 className="animate-spin text-blue-500" size={18} />
            ) : (
              <LinkIcon size={18} />
            )}
          </div>
          <input
            type="url"
            placeholder="Cole o link da imagem (Google Drive, URL direta...)"
            value={!inputValue.startsWith("data:") ? inputValue : ""}
            onChange={handleLinkChange}
            required={required}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
      )}

      {method === "FILE" && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50/50 hover:border-blue-400 transition-colors bg-slate-50 relative overflow-hidden group">
          {isProcessingFile ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-8 h-8 mb-3 text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-blue-500">Processando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-blue-500 transition-colors">
              <Upload className="w-8 h-8 mb-3" />
              <p className="mb-1 text-sm font-bold">
                <span className="underline">Clique para upload</span>
              </p>
              <p className="text-xs opacity-70">Aquivos até 50MB</p>
            </div>
          )}
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
      )}

      {/* Preview Area */}
      {preview && (
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 aspect-video ring-1 ring-slate-200 shadow-md group">
          {detectedType === "VIDEO" ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={preview}
                alt="Preview Thumbnail"
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Video size={24} className="text-white fill-current" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Video size={10} />
                Vídeo Detectado
              </div>
            </div>
          ) : (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm rounded text-xs font-bold text-white uppercase flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={12} />
                Imagem Válida
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setInputValue("");
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
            title="Remover Imagem"
          >
            <AlertCircle size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
