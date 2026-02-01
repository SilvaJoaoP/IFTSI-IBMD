"use client";

import { AlertTriangle, Ban, Clock } from "lucide-react";

interface StatusAlertProps {
  status?: string;
  suspendedUntil?: Date | string;
}

export function StatusAlert({ status, suspendedUntil }: StatusAlertProps) {
  if (!status || status === "ACTIVE") return null;

  // Check if suspension expired
  if (status === "SUSPENDED" && suspendedUntil) {
    if (new Date() >= new Date(suspendedUntil)) return null;
  }

  const isDeactivated = status === "DEACTIVATED";
  const dateStr = suspendedUntil
    ? new Date(suspendedUntil).toLocaleString("pt-BR")
    : "";

  return (
    <div
      className={`${isDeactivated ? "bg-red-600" : "bg-orange-500"} text-white px-4 py-3 shadow-lg relative z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${isDeactivated ? "bg-red-700" : "bg-orange-600"}`}
          >
            {isDeactivated ? <Ban size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <p className="font-bold text-sm md:text-base">
              {isDeactivated
                ? "Sua conta foi desativada."
                : "Sua conta está suspensa temporariamente."}
            </p>
            <p className="text-xs md:text-sm opacity-90">
              {isDeactivated
                ? "Você não tem permissão para realizar ações ou visualizar dados sensíveis."
                : `O acesso será restaurado automaticamente em ${dateStr}.`}
            </p>
          </div>
        </div>

        {/* Helper visual for time if suspended */}
        {!isDeactivated && (
          <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold">
            <Clock size={14} />
            <span>Restrição Ativa</span>
          </div>
        )}
      </div>
    </div>
  );
}
