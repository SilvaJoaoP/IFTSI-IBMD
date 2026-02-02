"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  Calendar as CalendarIcon,
  User,
  Users,
  Clock,
} from "lucide-react";

interface UserOption {
  id: string;
  nome: string;
  cargo: string;
}

interface EscalaItemData {
  usuarioId: string;
  funcao: string;
}

interface EscalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  users: UserOption[];
  existingEscala?: {
    id: string;
    titulo: string;
    descricao: string | null;
    items: { usuarioId: string; funcao: string }[];
    data: Date;
  } | null;
  onSave: (formData: FormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function EscalaModal({
  isOpen,
  onClose,
  selectedDate,
  users,
  existingEscala,
  onSave,
  onDelete,
}: EscalaModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [items, setItems] = useState<EscalaItemData[]>([]);
  const [horario, setHorario] = useState("19:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingEscala) {
        setTitulo(existingEscala.titulo);
        setDescricao(existingEscala.descricao || "");
        setItems(
          existingEscala.items.map((i) => ({
            usuarioId: i.usuarioId,
            funcao: i.funcao,
          })),
        );
        // Extrair horário do objeto Date
        const date = new Date(existingEscala.data);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        setHorario(`${hours}:${minutes}`);
      } else {
        setTitulo("");
        setDescricao("");
        setItems([]);
        setHorario("19:00");
      }
    }
  }, [isOpen, existingEscala]);

  if (!isOpen || !selectedDate) return null;

  const dateStr = selectedDate.toISOString().split("T")[0];
  const displayDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleAddItem = () => {
    setItems([...items, { usuarioId: "", funcao: "" }]);
  };

  const handleItemChange = (
    index: number,
    field: keyof EscalaItemData,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("data", dateStr);
    formData.append("horario", horario);

    const validItems = items.filter((i) => i.usuarioId && i.funcao);
    formData.append("items", JSON.stringify(validItems));

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      alert("Erro ao salvar escala");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEscala?.id || !onDelete) return;
    if (confirm("Tem certeza que deseja excluir esta escala?")) {
      setIsSubmitting(true);
      try {
        await onDelete(existingEscala.id);
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
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b3566] p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-1 uppercase tracking-wider">
              <Users size={14} />
              Nova Escala
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
          <form id="escalaForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-grow">
                <label className="text-sm font-bold text-slate-700">
                  Título da Escala
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ex: Culto Domingo - Ceia"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                />
              </div>
              <div className="space-y-2 w-full sm:w-32">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <Clock size={14} /> Horário
                </label>
                <input
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Descrição Geral (Opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes gerais da escala..."
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 resize-none"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-blue-500" />
                  Membros Escalados
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Adicionar Membro
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-left-2 duration-200 items-start sm:items-center"
                  >
                    <div className="flex-1 w-full pl-1">
                      <select
                        value={item.usuarioId}
                        onChange={(e) =>
                          handleItemChange(index, "usuarioId", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        required
                      >
                        <option value="">Selecione um membro...</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={item.funcao}
                        onChange={(e) =>
                          handleItemChange(index, "funcao", e.target.value)
                        }
                        placeholder="Função (ex: Recepcionista)"
                        className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-center py-4 text-slate-400 text-sm italic border border-dashed border-slate-200 rounded-xl">
                    Nenhum membro escalado ainda.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          {existingEscala ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Excluir Escala
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              form="escalaForm"
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0b3566] hover:bg-[#092b52] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={18} /> Salvar Escala
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
