"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventModal } from "@/components/EventModal";
import { DayDetailsModal } from "@/components/DayDetailsModal";
import {
  createEventAction,
  deleteEventAction,
  updateEventAction,
} from "./actions";

interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  links: string | null;
  dataInicio: Date;
}

interface CalendarClientProps {
  events: Evento[];
  currentDate: Date; // A data de referência do mês atual
  canCreate: boolean;
  canManageLinks: boolean;
}

export function CalendarClient({
  events,
  currentDate,
  canCreate,
  canManageLinks,
}: CalendarClientProps) {
  const router = useRouter();

  // Controle de Modais
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);

  // Estados de dados
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);

  // Navegação de Mês
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    const params = new URLSearchParams();
    params.set(
      "month",
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`,
    );
    router.push(`/calendario?${params.toString()}`);
  };

  // Helper para gerar o grid
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay(); // 0 = Domingo

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Array de dias
  const days = [];
  // Padding inicial (dias vazios)
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Dias reais
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const monthName = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // HANDLERS

  // Clicar no dia -> Abre visualização do dia
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayDetailsOpen(true);
  };

  // Clicar em "Adicionar" dentro do modal de detalhes -> Fecha detalhes, abre form (mantém selectedDate)
  const handleAddFromDayDetails = () => {
    setEditingEvent(null);
    setIsDayDetailsOpen(false); // Fecha detalhes e abre modal de edição
    setTimeout(() => setIsEventModalOpen(true), 100);
  };

  // Clicar em "Editar" dentro do modal de detalhes -> Fecha detalhes, abre form com evento
  const handleEditFromDayDetails = (event: Evento) => {
    setEditingEvent(event);
    setIsDayDetailsOpen(false);
    setTimeout(() => setIsEventModalOpen(true), 100);
  };

  // Excluir e salvar
  const handleSave = async (formData: FormData) => {
    if (editingEvent) {
      await updateEventAction(editingEvent.id, formData);
    } else {
      await createEventAction(formData);
    }
    setIsEventModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      await deleteEventAction(id);
    }
  };

  // Agrupar eventos por dia para renderização fácil
  const getEventsForDay = (date: Date) => {
    return events.filter((e) => {
      const d = new Date(e.dataInicio);
      // Comparar YYYY-MM-DD
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };

  // Dias da semana
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
            {monthName}
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

            const dayEvents = getEventsForDay(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                className={`min-h-[120px] p-2 border-b border-r border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer group relative flex flex-col gap-1 ${isToday ? "bg-blue-50/30" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                      isToday
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-700 group-hover:text-blue-600"
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="px-2 py-1 rounded bg-blue-100/50 border border-blue-100 text-blue-900 text-[10px] font-bold truncate flex items-center gap-1"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="truncate">{event.titulo}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[10px] text-slate-400 pl-1 font-medium">
                      + {dayEvents.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          selectedDate={selectedDate}
          existingEvent={editingEvent}
          onSave={handleSave}
          onDelete={async (id) => {
            await handleDelete(id);
            setIsEventModalOpen(false);
          }}
          canCreate={canCreate}
          canManageLinks={canManageLinks}
        />

        <DayDetailsModal
          isOpen={isDayDetailsOpen}
          onClose={() => setIsDayDetailsOpen(false)}
          date={selectedDate}
          events={selectedDate ? getEventsForDay(selectedDate) : []}
          onAdd={handleAddFromDayDetails}
          onEdit={handleEditFromDayDetails}
          onDelete={handleDelete}
          canCreate={canCreate}
          canManageLinks={canManageLinks}
        />
      </div>
    </div>
  );
}
