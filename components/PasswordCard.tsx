"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { updatePassword } from "@/app/(main)/perfil/actions";

export function PasswordCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);

    const p1 = formData.get("newPassword") as string;
    const p2 = formData.get("confirmPassword") as string;

    if (p1 !== p2) {
      setMessage({ type: "error", text: "As senhas não coincidem." });
      setIsLoading(false);
      return;
    }

    if (p1.length < 8) {
      setMessage({
        type: "error",
        text: "A senha deve ter no mínimo 8 caracteres.",
      });
      setIsLoading(false);
      return;
    }

    const result = await updatePassword(formData);
    setIsLoading(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      // Reset form visually by closing and reopening or just closing
      setTimeout(() => {
        setIsEditing(false);
        setMessage(null);
      }, 2000);
    }
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Key size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Segurança</h3>
          <p className="text-sm text-slate-500">Gerencie sua senha de acesso</p>
        </div>
      </div>

      {!isEditing ? (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-white p-2 rounded-lg text-slate-400">
              <Key size={18} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Senha Atual
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-700 text-lg tracking-widest leading-none mt-1">
                  ••••••••••••
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto text-blue-600 hover:text-blue-700 font-bold text-sm px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
            >
              Alterar Senha
            </button>
          </div>
        </div>
      ) : (
        <form
          action={handleSubmit}
          className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Definir Nova Senha
            </h4>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-blue-600 flex items-center gap-1.5 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPassword ? "Ocultar Senha" : "Mostrar Senha"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Nova Senha
              </label>
              <input
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo de 8 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium bg-white"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Confirmar Senha
              </label>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Digite novamente a senha"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium bg-white"
                required
                minLength={8}
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-1 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <Check size={18} />
              ) : (
                <X size={18} />
              )}
              {message.text}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setMessage(null);
              }}
              className="flex-1 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-200 font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#0b3566] hover:bg-[#092b52] text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              )}
              {isLoading ? "Salvando..." : "Salvar Senha"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
