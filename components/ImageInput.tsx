"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Upload,
  Loader2,
  CheckCircle2,
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
    "IMAGEM"
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
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    setDetectedType("IMAGEM");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);

    if (file.type.startsWith("video/")) {
      setDetectedType("VIDEO");
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputValue(e.target?.result as string);
        setPreview(e.target?.result as string);
        setIsProcessingFile(false);
      };
      reader.readAsDataURL(file);
    } else {
      setDetectedType("IMAGEM");
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxW = 1200;
          const scale = maxW / img.width;
          canvas.width = maxW;
          canvas.height = img.height * scale;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL("image/jpeg", 0.7);
          setInputValue(compressed);
          setPreview(compressed);
          setIsProcessingFile(false);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 border border-gray-200 p-4 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <div className="flex items-center gap-2">
          {isCheckingDrive || isProcessingFile ? (
            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Verificando...
            </span>
          ) : inputValue ? (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded border ${
                detectedType === "VIDEO"
                  ? "bg-purple-100 text-purple-700 border-purple-200"
                  : "bg-green-100 text-green-700 border-green-200"
              }`}
            >
              {detectedType === "VIDEO" ? (
                <Video size={12} />
              ) : (
                <ImageIcon size={12} />
              )}
              {detectedType}
            </span>
          ) : null}
        </div>
      </div>

      <input type="hidden" name={name} value={inputValue} />
      <input type="hidden" name="tipo" value={detectedType} />

      <div className="flex space-x-1">
        <button
          type="button"
          onClick={() => setMethod("LINK")}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-t-md border-t border-l border-r transition-all ${
            method === "LINK"
              ? "bg-white border-b-transparent text-blue-600 font-medium shadow-sm"
              : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
          }`}
        >
          <LinkIcon size={16} /> Link / Drive
        </button>
        <button
          type="button"
          onClick={() => setMethod("FILE")}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-t-md border-t border-l border-r transition-all ${
            method === "FILE"
              ? "bg-white border-b-transparent text-blue-600 font-medium shadow-sm"
              : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Upload size={16} /> Upload
        </button>
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-b-md rounded-tr-md -mt-px shadow-sm">
        {method === "LINK" ? (
          <div>
            <input
              type="url"
              placeholder="Cole o link aqui..."
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              defaultValue={defaultValue || ""}
              onChange={handleLinkChange}
              disabled={isCheckingDrive}
            />
            {isCheckingDrive && (
              <p className="text-xs text-blue-500 mt-2">
                Conectando ao Google Drive para identificar o arquivo...
              </p>
            )}
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        )}

        {preview && !isCheckingDrive && !isProcessingFile && (
          <div className="mt-4 border rounded-lg overflow-hidden bg-gray-100 flex justify-center items-center relative min-h-[200px]">
            {detectedType === "VIDEO" ? (
              <div className="relative w-full flex justify-center">
                {isDriveLink(inputValue) ? (
                  <>
                    <img
                      src={preview}
                      alt="Capa Vídeo"
                      className="max-h-64 object-contain opacity-90"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg">
                        <Video size={32} className="text-purple-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Vídeo do Drive
                    </div>
                  </>
                ) : (
                  <video
                    src={preview}
                    controls
                    className="max-h-64 w-full rounded"
                  />
                )}
              </div>
            ) : (
              <div className="relative group w-full flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={10} /> Imagem Válida
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
