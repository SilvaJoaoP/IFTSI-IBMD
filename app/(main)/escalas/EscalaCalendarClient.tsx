"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Users, Plus } from "lucide-react";
import { EscalaModal } from "@/components/EscalaModal";
import { EscalaDetailsModal } from "@/components/EscalaDetailsModal";
import {
  createEscalaAction,
  deleteEscalaAction,
  updateEscalaAction,
} from "./actions";

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

interface UserOption {
  id: string;
  nome: string;
  cargo: string;
}

interface EscalaCalendarClientProps {
  escalas: Escala[];
  currentDate: Date;
  users: UserOption[];
  isPastor: boolean;
}

export function EscalaCalendarClient({
  escalas,
  currentDate,
  users,
  isPastor,
}: EscalaCalendarClientProps) {
  const router = useRouter();

  // Controle de Modais
  const [isEscalaModalOpen, setIsEscalaModalOpen] = useState(false);
  const [selectedEscalaDetails, setSelectedEscalaDetails] =
    useState<Escala | null>(null);

  // Estados de dados
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingEscala, setEditingEscala] = useState<Escala | null>(null);

  // Navegação de Mês
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    const params = new URLSearchParams();
    params.set(
      "month",
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`,
    );
    router.push(`/escalas?${params.toString()}`);
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const monthName = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // HANDLERS

  const getEscalasForDay = (date: Date) => {
    return escalas.filter((e) => {
      const d = new Date(e.data);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDayClick = (date: Date) => {
    if (isPastor) {
      setSelectedDate(date);
      setEditingEscala(null);
      setIsEscalaModalOpen(true);
    }
  };

  const handleEscalaClick = (escala: Escala) => {
    setSelectedEscalaDetails(escala);
  };

  const handleNewEscala = () => {
    if (!isPastor) return;
    setSelectedDate(new Date());
    setEditingEscala(null);
    setIsEscalaModalOpen(true);
  };

  const handleSave = async (formData: FormData) => {
    if (editingEscala) {
      await updateEscalaAction(editingEscala.id, formData);
    } else {
      await createEscalaAction(formData);
    }
    setIsEscalaModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta escala?")) {
      await deleteEscalaAction(id);
      setIsEscalaModalOpen(false);
      setSelectedEscalaDetails(null);
    }
  };

  const weekDays = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header do Calendário */}
        <div className="flex items-center justify-between p-6 bg-[#0b3566]">
          <h2 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
            <Users size={24} className="text-blue-300" /> {monthName}
          </h2>
          <div className="flex bg-[#092b52] rounded-lg p-1">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="w-px bg-white/10 mx-1"></div>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Grid de Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {weekDays.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((date, i) => {
            if (!date)
              return (
                <div
                  key={`empty-${i}`}
                  className="bg-slate-50/30 border-b border-r border-slate-100 min-h-[120px]"
                />
              );

            const dayEscalas = getEscalasForDay(date);
            const isToday = new Date().toDateString() === date.toDateString();
            const hasEscala = dayEscalas.length > 0;

            // Se for Pastor, vê todos os dias como interativos.
            // Se for Membro, vê apenas dias com escala como interativos (visual).
            const isInteractive = isPastor || hasEscala;

            return (
              <div
                key={date.toISOString()}
                onClick={() => isInteractive && handleDayClick(date)}
                className={`min-h-[120px] p-2 border-b border-r border-slate-100 transition-colors group relative flex flex-col gap-1 
                    ${isInteractive ? "cursor-pointer hover:bg-blue-50/50" : "bg-slate-50/10"}
                    ${isToday ? "bg-blue-50/30" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                      isToday
                        ? "bg-blue-600 text-white shadow-md"
                        : isInteractive
                          ? "text-slate-700 group-hover:text-blue-600"
                          : "text-slate-400"
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {hasEscala && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 rounded-full flex items-center gap-1">
                      <Users size={10} />
                      {dayEscalas.length}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {dayEscalas.map((escala) => (
                    <div
                      key={escala.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEscalaClick(escala);
                      }}
                      className="cursor-pointer px-2 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-800 text-xs font-bold truncate flex items-center gap-1.5 hover:bg-green-100 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-[10px] opacity-75 font-mono">
                        {new Date(escala.data).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="truncate">{escala.titulo}</span>
                    </div>
                  ))}
                </div>

                {/* Indicador visual para pastor criar escala em dia vazio */}
                {isPastor && !hasEscala && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1">
                      <Plus size={12} /> Criar
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isPastor && (
          <EscalaModal
            isOpen={isEscalaModalOpen}
            onClose={() => setIsEscalaModalOpen(false)}
            selectedDate={selectedDate}
            users={users}
            existingEscala={editingEscala}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}

        <EscalaDetailsModal
          isOpen={!!selectedEscalaDetails}
          onClose={() => setSelectedEscalaDetails(null)}
          escala={selectedEscalaDetails}
          isPastor={isPastor}
          onEdit={(escala) => {
            setSelectedEscalaDetails(null);
            setEditingEscala(escala);
            setIsEscalaModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
