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
    return id ? `https://drive.google.com/file/d/${id}/preview` : url;
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {midias.map((midia) => {
          const isLocal = midia.tipo === "VIDEO" && isLocalVideo(midia.url);

          return (
            <div
              key={midia.id}
              className="relative group bg-gray-900 rounded-lg overflow-hidden aspect-square border border-gray-200 shadow-sm"
            >
              {midia.tipo === "VIDEO" ? (
                <div className="w-full h-full relative">
                  {isLocal ? (
                    // VÍDEO LOCAL
                    <video
                      src={midia.url}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  ) : (
                    // VÍDEO DRIVE COM THUMBNAIL
                    <div className="w-full h-full relative">
                      <img
                        src={getDriveThumbnailUrl(midia.url)}
                        alt="Capa do Vídeo"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />

                      {/* Fallback caso a thumbnail falhe (inicialmente oculto com 'hidden') */}
                      <div className="hidden absolute inset-0 flex-col items-center justify-center bg-gray-800 text-gray-400">
                        <Video size={48} className="mb-2 opacity-50" />
                        <span className="text-[10px] uppercase font-bold">
                          Sem Capa
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Ícone Play (Sempre visível em cima da capa) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PlayCircle
                      size={48}
                      className="text-white/80 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded-full z-10 pointer-events-none">
                    {isLocal ? "Vídeo" : "Drive"}
                  </div>
                </div>
              ) : (
                <img
                  src={midia.url}
                  alt="Mídia"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* OVERLAY DE AÇÕES */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 pointer-events-none">
                <button
                  onClick={() => setSelectedMedia(midia)}
                  className="bg-white text-blue-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 flex items-center gap-2 transition-transform hover:scale-105 shadow-md pointer-events-auto"
                >
                  <Eye size={16} />
                </button>

                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm("Tem certeza?")) onDelete(midia.id);
                    }}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-transform hover:scale-105 shadow-md pointer-events-auto"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-gray-800/50 p-2 rounded-full transition-colors"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-6xl h-full flex items-center justify-center p-4">
            {selectedMedia.tipo === "VIDEO" ? (
              isLocalVideo(selectedMedia.url) ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] rounded-lg shadow-2xl bg-black"
                />
              ) : (
                <div className="w-full h-full max-h-[85vh] aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
                  <iframe
                    src={getDriveEmbedUrl(selectedMedia.url)}
                    className="w-full h-full flex-1"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                  <div className="bg-gray-900 text-white p-2 text-center text-xs flex justify-center gap-2">
                    <a
                      href={selectedMedia.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Abrir no Drive <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              )
            ) : (
              <img
                src={selectedMedia.url}
                alt="Visualização"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
