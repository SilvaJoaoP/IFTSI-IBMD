"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginUser, type LoginState } from "./actions";
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";

const initialState: LoginState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#0b3566] hover:bg-[#092c54] text-white font-bold h-14 rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-base"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Entrando...</span>
        </>
      ) : (
        <>
          <span>Entrar na Plataforma</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-80" />
        </>
      )}
    </button>
  );
}

export default function Page() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white relative flex-col justify-center items-center overflow-hidden">
      {/* Container Centralizado */}
      <div className="w-full max-w-[420px] p-8 relative z-10">
        {/* Header Ultra Minimalista */}
        <div className="mb-10 text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold tracking-tighter text-slate-900">
            Bem-vindo(a)
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Entre na sua conta para continuar.
          </p>
        </div>

        {/* Formulário Moderno */}
        <form
          action={formAction}
          className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100"
        >
          {!state.success && state.message && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 flex items-center justify-center text-center animate-in zoom-in-95">
              {state.message}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2 group">
              <label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#0b3566]"
              >
                E-mail
              </label>
              <div className="relative transform transition-all duration-300 focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0b3566] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="exemplo@ibmd.com"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-[#0b3566]/20 focus:ring-4 focus:ring-[#0b3566]/5 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 text-base"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="senha"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-[#0b3566]"
                >
                  Senha
                </label>
                <Link
                  href="/auth/forgot"
                  className="text-xs font-bold text-[#0b3566] hover:text-blue-700 transition-colors"
                >
                  Esqueceu?
                </Link>
              </div>

              <div className="relative transform transition-all duration-300 focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0b3566] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  name="senha"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-[#0b3566]/20 focus:ring-4 focus:ring-[#0b3566]/5 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b3566] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>

          <p className="text-center text-sm text-slate-500 pt-4">
            Novo usuário?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-[#0b3566] hover:underline transition-all"
            >
              Solicitar acesso
            </Link>
          </p>
        </form>
      </div>

      {/* Footer minimalista */}
      <div className="absolute bottom-6 text-center w-full text-[10px] uppercase tracking-widest text-slate-300 font-semibold select-none">
        IBMD Gestão • 2.0
      </div>
    </div>
  );
}
