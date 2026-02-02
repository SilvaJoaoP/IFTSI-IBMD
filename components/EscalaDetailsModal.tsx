"use client";

import {
  X,
  Edit,
  Trash2,
  Users,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";

interface EscalaItem {
  usuarioId: string;
  funcao: string;
  usuario: {
    nome: string;
  };
}

interface Escala {
  id: string;
  titulo: string;
  descricao: string | null;
  items: EscalaItem[];
  data: Date;
}

interface EscalaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  escala: Escala | null;
  isPastor: boolean;
  onEdit: (escala: Escala) => void;
  onDelete: (id: string) => void;
}

export function EscalaDetailsModal({
  isOpen,
  onClose,
  escala,
  isPastor,
  onEdit,
  onDelete,
}: EscalaDetailsModalProps) {
  if (!isOpen || !escala) return null;

  const displayDate = new Date(escala.data).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0b3566] p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">
              <CalendarIcon size={14} />
              Detalhes da Escala
            </div>
            <h2 className="text-2xl font-bold capitalize leading-tight">
              {escala.titulo}
            </h2>
            <p className="text-blue-100/80 text-sm mt-1 capitalize">
              {displayDate} •{" "}
              {new Date(escala.data).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {escala.descricao && (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <p className="text-slate-700 text-sm leading-relaxed">
                {escala.descricao}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users size={16} /> Equipe Escalada
            </h3>

            <div className="space-y-3">
              {escala.items.length > 0 ? (
                escala.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {item.usuario.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {item.usuario.nome}
                      </h4>
                      <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {item.funcao}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Nenhum membro escalado.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions for Pastor */}
        {isPastor && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-2 justify-end">
            <button
              onClick={() => onDelete(escala.id)}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Excluir
            </button>
            <button
              onClick={() => onEdit(escala)}
              className="bg-[#0b3566] hover:bg-[#092b52] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2"
            >
              <Edit size={16} /> Editar Escala
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
