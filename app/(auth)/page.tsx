"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
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
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export default function PaginaLogin() {
  const [state, formAction] = useFormState(loginUser, initialState);

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">IBMD Gestão</h2>
      <h3 className="text-xl font-semibold text-center mb-6">Login</h3>
      <form action={formAction} className="space-y-4">
        {}
        {!state.success && state.message && (
          <p className="text-sm text-red-600 text-center">{state.message}</p>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="senha"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <SubmitButton />
      </form>
    </>
  );
}
