"use client";

import {
  X,
  Edit,
  Trash2,
  ExternalLink,
  Calendar as CalendarIcon,
  Plus,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  links: string | null; // JSON string
  dataInicio: Date;
}

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Evento[];
  onEdit: (event: Evento) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  canCreate: boolean;
  canManageLinks: boolean;
}

interface LinkItem {
  url: string;
  title: string;
}

function EventCard({
  event,
  onEdit,
  onDelete,
  canCreate,
  canManageLinks,
}: {
  event: Evento;
  onEdit: (event: Evento) => void;
  onDelete: (id: string) => void;
  canCreate: boolean;
  canManageLinks: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const parseLinks = (jsonLinks: string | null): LinkItem[] => {
    if (!jsonLinks) return [];
    try {
      const parsed = JSON.parse(jsonLinks);
      // Backward compatibility
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === "string") {
          return parsed.map((l: string) => ({ url: l, title: "" }));
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  };

  const links = parseLinks(event.links);

  return (
    <div
      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
        isExpanded
          ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-100"
          : "bg-slate-50 border-slate-200 hover:border-blue-200 hover:bg-white"
      }`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer flex gap-3 select-none"
      >
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold text-slate-800 text-lg leading-tight break-words ${
              !isExpanded && "truncate"
            }`}
          >
            {event.titulo}
          </h3>

          {!isExpanded && (
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              {event.descricao && (
                <span className="truncate max-w-[150px] opacity-70">
                  {event.descricao}
                </span>
              )}
              {links.length > 0 && (
                <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                  <LinkIcon size={10} /> {links.length}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
          {event.descricao && (
            <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap break-words leading-relaxed border-t border-slate-100 pt-3">
              {event.descricao}
            </p>
          )}

          {links.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Links Anexados
              </span>
              <div className="flex flex-wrap gap-2">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 max-w-full truncate"
                    title={link.url}
                  >
                    <LinkIcon size={12} className="shrink-0" />
                    <span className="truncate">{link.title || link.url}</span>
                    <ExternalLink size={10} className="shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
            {(canCreate || canManageLinks) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="px-3 py-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Edit size={14} /> Editar
              </button>
            )}
            {canCreate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                className="px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Excluir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function DayDetailsModal({
  isOpen,
  onClose,
  date,
  events,
  onEdit,
  onDelete,
  onAdd,
  canCreate,
  canManageLinks,
}: DayDetailsModalProps) {
  if (!isOpen || !date) return null;

  const displayDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Ordenar eventos (opcional, pode ser por horário se tiver)
  const sortedEvents = [...events];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0b3566] p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">
              <CalendarIcon size={14} />
              Detalhes do Dia
            </div>
            <h2 className="text-2xl font-bold capitalize leading-tight">
              {displayDate}
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              {events.length} evento(s) agendado(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Eventos */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
                canCreate={canCreate}
                canManageLinks={canManageLinks}
              />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <CalendarIcon size={32} />
              </div>
              <p>Nenhum evento agendado.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {canCreate && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <button
              onClick={onAdd}
              className="w-full bg-[#0b3566] hover:bg-[#092b52] text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Adicionar Evento neste Dia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
