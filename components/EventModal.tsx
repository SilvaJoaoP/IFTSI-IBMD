"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Link as LinkIcon,
  Save,
  Calendar as CalendarIcon,
} from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  existingEvent?: {
    id: string;
    titulo: string;
    descricao: string | null;
    links: string | null;
  } | null;
  onSave: (formData: FormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  canCreate?: boolean;
  canManageLinks?: boolean;
}

interface LinkItem {
  url: string;
  title: string;
}

export function EventModal({
  isOpen,
  onClose,
  selectedDate,
  existingEvent,
  onSave,
  onDelete,
  canCreate = false,
  canManageLinks = false,
}: EventModalProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        setTitulo(existingEvent.titulo || "");
        setDescricao(existingEvent.descricao || "");
        try {
          const parsed = existingEvent.links
            ? JSON.parse(existingEvent.links)
            : [];
          // Normaliza formato antigo (string[]) para novo (LinkItem[])
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === "string") {
              setLinks(parsed.map((l: string) => ({ url: l, title: "" })));
            } else {
              setLinks(parsed);
            }
          } else {
            setLinks([]);
          }
        } catch {
          setLinks([]);
        }
      } else {
        setTitulo("");
        setDescricao("");
        setLinks([]);
      }
    }
  }, [isOpen, existingEvent]);

  if (!isOpen || !selectedDate) return null;

  const dateStr = selectedDate.toISOString().split("T")[0];
  const displayDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleAddLink = () => {
    setLinks([...links, { url: "", title: "" }]);
  };

  const handleLinkUrlChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index].url = value;
    setLinks(newLinks);
  };

  const handleLinkTitleChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index].title = value;
    setLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("data", dateStr);

    // Filter out empty links
    const validLinks = links.filter((l) => l.url.trim() !== "");
    formData.append("links", JSON.stringify(validLinks));

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      alert("Erro ao salvar evento");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEvent?.id || !onDelete) return;
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      setIsSubmitting(true);
      try {
        await onDelete(existingEvent.id);
        onClose();
      } catch (error) {
        alert("Erro ao excluir");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b3566] p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">
              <CalendarIcon size={14} />
              Novo Evento
            </div>
            <h2 className="text-2xl font-bold capitalize">{displayDate}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="eventForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Nome do Evento
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                disabled={!canCreate}
                placeholder="Ex: Culto de Jovens"
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 ${
                  !canCreate ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Descrição (Opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={!canCreate}
                placeholder="Detalhes sobre o evento..."
                rows={3}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 resize-none ${
                  !canCreate ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LinkIcon size={16} className="text-blue-500" />
                  Links de Divulgação
                </label>
                {(canManageLinks || canCreate) && (
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus size={12} /> Adicionar Link
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-left-2 duration-200"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) =>
                          handleLinkTitleChange(index, e.target.value)
                        }
                        disabled={!(canManageLinks || canCreate)}
                        placeholder="Título do Link (ex: Inscrição)"
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium disabled:opacity-60"
                      />
                      {(canManageLinks || canCreate) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        handleLinkUrlChange(index, e.target.value)
                      }
                      disabled={!(canManageLinks || canCreate)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-mono text-xs text-slate-500 disabled:opacity-60"
                    />
                  </div>
                ))}
                {links.length === 0 && (
                  <p className="text-xs text-slate-400 italic">
                    Nenhum link adicionado.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          {existingEvent && canCreate ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Excluir
            </button>
          ) : (
            <div></div> // Spacer
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            {(canCreate || canManageLinks) && (
              <button
                form="eventForm"
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0b3566] hover:bg-[#092b52] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save size={18} /> Salvar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
