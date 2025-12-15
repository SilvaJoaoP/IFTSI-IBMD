"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginUser, type LoginState } from "./actions";

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
      className="w-full bg-[#0b3566] hover:bg-[#072646] text-white px-4 py-2 rounded-md disabled:bg-gray-400 transition-colors duration-200"
    >
      {pending ? "Entrando..." : "Entre"}
    </button>
  );
}

export default function Page() {
  const [state, formAction] = useActionState(loginUser, initialState);

  const inputStyledClasses =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white transition-all duration-200";

  return (
    <main className="relative min-h-screen bg-white">
      <div className="min-h-screen flex flex-col items-center pt-28">
        <div className="w-full max-w-sm text-center bg-white p-8 rounded-xl shadow-lg">
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Monte de Deus - Logo"
              className="h-28 w-auto object-contain"
            />
          </div>

          {/* TÍTULO E SUBTÍTULO */}
          <h2 className="text-2xl font-extrabold text-[#0b3566] mb-2">
            Bem-vindo de volta!
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            Não tem uma conta?{" "}
            <Link href="/auth/register" className="text-blue-600 underline">
              Criar uma conta
            </Link>
          </p>

          {/* FORMULÁRIO com a lógica de Server Action */}
          <form action={formAction} className="space-y-4 text-left">
            {/* MENSAGEM DE ERRO/SUCESSO */}
            {!state.success && state.message && (
              <p className="text-sm text-red-600 text-center">
                {state.message}
              </p>
            )}

            {/* CAMPO E-MAIL */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                className={inputStyledClasses}
              />
            </div>

            {/* CAMPO SENHA */}
            <div>
              <label htmlFor="senha" className="sr-only">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Senha"
                required
                className={inputStyledClasses}
              />
            </div>

            {/* BOTÃO SUBMIT */}
            <SubmitButton />

            {/* LINK ESQUECEU A SENHA */}
            <div className="text-center mt-3">
              <Link
                href="/auth/forgot"
                className="text-sm text-blue-600 underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* RODAPÉ FIXO COM TERMOS */}
      <div className="absolute left-0 right-0 bottom-6 flex justify-center">
        <p className="text-xs text-gray-500 max-w-screen-sm text-center px-4">
          Ao continuar, você concorda com nossos{" "}
          <Link href="/terms" className="underline">
            Termos de Compromisso
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
