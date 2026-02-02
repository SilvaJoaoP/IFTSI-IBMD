"use client";

import { BackButton } from "@/components/BackButton";
import { createRegistroFinanceiro } from "../../actions";
import { useParams } from "next/navigation";

export default function NovaEntradaPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href={`/planilhas/${id}`} />
      </div>

      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Registro de Entrada
        </h1>
        <p className="text-slate-500 mb-8">
          Adicione uma nova entrada financeira na planilha.
        </p>

        <form action={createRegistroFinanceiro} className="space-y-6">
          <input type="hidden" name="planilhaId" value={id} />
          <input type="hidden" name="tipo" value="ENTRADA" />

          <div>
            <label
              htmlFor="value"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Valor
            </label>
            <input
              type="number"
              id="value"
              name="value"
              step="0.01"
              className="w-full border border-gray-200 rounded-xl p-3 text-lg focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400 font-bold text-emerald-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="contaDigital"
              name="contaDigital"
              className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-all"
            />
            <label
              htmlFor="contaDigital"
              className="ml-3 block text-sm font-medium text-slate-700"
            >
              Registro da Conta Digital
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 duration-200 mt-4"
          >
            Registrar Entrada
          </button>
        </form>
      </div>
    </div>
  );
}
