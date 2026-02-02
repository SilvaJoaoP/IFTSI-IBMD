"use client";

import { useState } from "react";
import {
  Ban,
  Timer,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Clock,
  Unlock,
} from "lucide-react";
import { updateUserStatusAction } from "@/app/(main)/gestao-cargos/statusActions";

export function UserStatusManager({
  userId,
  currentStatus,
  suspendedUntil,
}: {
  userId: string;
  currentStatus: string;
  suspendedUntil: Date | null | undefined;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suspensionDuration, setSuspensionDuration] = useState<number>(1);
  const [suspensionUnit, setSuspensionUnit] = useState<"hours" | "days">(
    "days",
  );

  const [dateSuspendedUntil, setDateSuspendedUntil] = useState<Date | null>(
    suspendedUntil ? new Date(suspendedUntil) : null,
  );

  const displayStatus = (() => {
    if (currentStatus === "DEACTIVATED")
      return {
        label: "Desativada",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    if (currentStatus === "SUSPENDED") {
      if (dateSuspendedUntil && new Date() < dateSuspendedUntil) {
        return {
          label: "Suspensa",
          color: "bg-orange-100 text-orange-700 border-orange-200",
        };
      }
      return {
        label: "Ativa (Suspensão Expirada)",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    }
    return {
      label: "Ativa",
      color: "bg-green-100 text-green-700 border-green-200",
    };
  })();

  async function handleStatusChange(
    status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED",
    until?: Date,
  ) {
    setIsLoading(true);
    const result = await updateUserStatusAction(userId, status, until);
    if (!result.success) {
      alert(result.message);
    }
    setIsLoading(false);
    setIsModalOpen(false);
  }

  const handleApplySuspension = () => {
    const now = new Date();
    const until = new Date(now);
    if (suspensionUnit === "hours") {
      until.setHours(until.getHours() + suspensionDuration);
    } else {
      until.setDate(until.getDate() + suspensionDuration);
    }
    handleStatusChange("SUSPENDED", until);
  };

  return (
    <div className="flex flex-row items-center gap-3">
      <span
        className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${displayStatus.color}`}
      >
        {displayStatus.label}
      </span>

      <div className="flex items-center gap-2">
        {currentStatus !== "ACTIVE" &&
          !(
            currentStatus === "SUSPENDED" &&
            dateSuspendedUntil &&
            new Date() > dateSuspendedUntil
          ) && (
            <button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={isLoading}
              className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-colors border border-green-100 hover:border-green-600"
              title="Reativar Conta"
            >
              <Unlock size={18} />
            </button>
          )}

        {currentStatus !== "DEACTIVATED" && (
          <button
            onClick={() => handleStatusChange("DEACTIVATED")}
            disabled={isLoading}
            className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-100 hover:border-red-600"
            title="Desativar Conta Permanentemente"
          >
            <Ban size={18} />
          </button>
        )}

        {currentStatus !== "SUSPENDED" && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="p-2 text-orange-600 hover:text-white hover:bg-orange-600 rounded-lg transition-colors border border-orange-100 hover:border-orange-600"
            title="Suspender Temporariamente"
          >
            <Timer size={18} />
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Timer className="text-orange-500" size={20} />
                  Suspender Conta
                </h3>
                <p className="text-sm text-slate-500">
                  Defina por quanto tempo o usuário ficará sem acesso.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Duração
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={suspensionDuration}
                  onChange={(e) =>
                    setSuspensionDuration(Number(e.target.value))
                  }
                  className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-center font-bold"
                />
                <select
                  value={suspensionUnit}
                  onChange={(e) => setSuspensionUnit(e.target.value as any)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium"
                >
                  <option value="hours">Horas</option>
                  <option value="days">Dias</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleApplySuspension}
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Aplicando..." : "Confirmar Suspensão"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
