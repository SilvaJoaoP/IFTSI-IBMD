"use client";

import { useState } from "react";
import { Trash2, Eye, X, PlayCircle, Video, ExternalLink } from "lucide-react";

interface Midia {
  id: string;
  url: string;
  tipo: string;
}

interface MediaGalleryProps {
  midias: Midia[];
  onDelete?: (id: string) => void;
}

export function MediaGallery({ midias, onDelete }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Midia | null>(null);

  const isLocalVideo = (url: string) => url.startsWith("data:video");

  const getDriveId = (url: string) => {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return idMatch ? idMatch[1] : null;
  };

  const getDriveEmbedUrl = (url: string) => {
    const id = getDriveId(url);
    if (!id) return url;
    return `https://drive.google.com/file/d/${id}/preview`;
  };

  const getDriveThumbnailUrl = (url: string) => {
    const id = getDriveId(url);
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w800` : "";
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.currentTarget.play().catch(() => {});
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  };

  if (midias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 min-h-[300px]">
        <div className="bg-slate-100 p-4 rounded-full mb-3">
          <Video size={32} className="text-slate-300" />
        </div>
        <p className="text-lg font-medium">Nenhuma mídia encontrada</p>
        <p className="text-sm">Adicione fotos ou vídeos acima para começar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {midias.map((midia) => {
          const isLocal = midia.tipo === "VIDEO" && isLocalVideo(midia.url);

          return (
            <div
              key={midia.id}
              className="relative group bg-slate-900 rounded-3xl overflow-hidden aspect-square border-4 border-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {midia.tipo === "VIDEO" ? (
                <div className="w-full h-full relative bg-black">
                  {isLocal ? (
                    // VÍDEO LOCAL
                    <video
                      src={midia.url}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  ) : (
                    // VÍDEO DRIVE
                    <div className="w-full h-full relative">
                      <img
                        src={getDriveThumbnailUrl(midia.url)}
                        alt="Capa do Vídeo"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden",
                          );
                        }}
                      />

                      <div className="hidden absolute inset-0 flex-col items-center justify-center bg-slate-800 text-slate-400">
                        <Video size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          Vídeo
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PlayCircle
                        size={28}
                        className="text-white fill-current"
                      />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] uppercase font-bold rounded-lg z-10 pointer-events-none border border-white/10">
                    {isLocal ? "Arquivo" : "Drive"}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={midia.url}
                    alt="Mídia"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              {/* OVERLAY ACTIONS */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  onClick={() => setSelectedMedia(midia)}
                  title="Visualizar"
                  className="bg-white/90 hover:bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                >
                  <Eye size={18} />
                </button>

                {onDelete && (
                  <button
                    onClick={() => {
                      if (
                        confirm("Tem certeza que deseja remover esta mídia?")
                      ) {
                        onDelete(midia.id);
                      }
                    }}
                    title="Excluir"
                    className="bg-red-500/90 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={28} />
          </button>

          <div
            className="relative w-full max-w-6xl h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.tipo === "VIDEO" ? (
              isLocalVideo(selectedMedia.url) ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl bg-black border border-white/10"
                />
              ) : (
                <div className="w-full h-full max-h-[85vh] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
                  <iframe
                    src={getDriveEmbedUrl(selectedMedia.url)}
                    className="w-full h-full flex-1"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                  <div className="bg-slate-950/50 backdrop-blur text-white p-3 text-center text-sm flex justify-center gap-3 border-t border-white/10">
                    <span className="text-white/60">
                      Este vídeo está hospedado no Google Drive.
                    </span>
                    <a
                      href={selectedMedia.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-medium"
                    >
                      Abrir no Drive <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )
            ) : (
              <img
                src={selectedMedia.url}
                alt="Visualização"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
