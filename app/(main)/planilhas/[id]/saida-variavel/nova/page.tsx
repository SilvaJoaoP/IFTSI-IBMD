"use client";

import { BackButton } from "@/components/BackButton";
import { createRegistroFinanceiro } from "../../actions";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function NovaSaidaVariavelPage() {
  const params = useParams();
  const id = params?.id as string;
  const [parcelado, setParcelado] = useState(false);

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href={`/planilhas/${id}`} />
      </div>

      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Registro de Saída Variável
        </h1>
        <p className="text-slate-500 mb-8">
          Registre uma saída pontual ou compra parcelada.
        </p>

        <form action={createRegistroFinanceiro} className="space-y-6">
          <input type="hidden" name="planilhaId" value={id} />
          <input type="hidden" name="tipo" value="SAIDA_VARIAVEL" />

          <div>
            <label
              htmlFor="value"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Valor (da parcela se parcelado)
            </label>
            <input
              type="number"
              id="value"
              name="value"
              step="0.01"
              className="w-full border border-gray-200 rounded-xl p-3 text-lg focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400 font-bold text-orange-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Data (1ª parcela)
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
              id="parcelado"
              name="parcelado"
              checked={parcelado}
              onChange={(e) => setParcelado(e.target.checked)}
              className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-all"
            />
            <label
              htmlFor="parcelado"
              className="ml-3 block text-sm font-medium text-slate-700"
            >
              Parcelado?
            </label>
          </div>

          {parcelado && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <label
                htmlFor="totalParcelas"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Número de Parcelas
              </label>
              <input
                type="number"
                id="totalParcelas"
                name="totalParcelas"
                min="2"
                defaultValue="2"
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none bg-slate-50 text-slate-900 transition-all"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="receipt"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Comprovante (Opcional)
            </label>
            <input
              type="file"
              id="receipt"
              name="receipt"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all"
            />
          </div>

          <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="contaDigital"
              name="contaDigital"
              className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-all"
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
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 duration-200 mt-4"
          >
            Registrar Saída
          </button>
        </form>
      </div>
    </div>
  );
}
