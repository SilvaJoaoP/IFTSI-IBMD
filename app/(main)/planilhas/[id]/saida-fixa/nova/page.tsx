"use client";

import { BackButton } from "@/components/BackButton";
import { createRegistroFinanceiro } from "../../actions";
import { useParams } from "next/navigation";

export default function NovaSaidaFixaPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div>
      <BackButton href={`/planilhas/${id}`} />
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Registro de Saída Fixa</h1>
        <form action={createRegistroFinanceiro}>
          <input type="hidden" name="planilhaId" value={id} />
          <input type="hidden" name="tipo" value="SAIDA_FIXA" />
          
          <div className="mb-4">
            <label htmlFor="value" className="block text-sm font-medium text-gray-300">
              Valor
            </label>
            <input
              type="number"
              id="value"
              name="value"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-300">
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="receipt" className="block text-sm font-medium text-gray-300">
              Comprovante (Opcional)
            </label>
            <input
              type="file"
              id="receipt"
              name="receipt"
              className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="contaDigital"
              name="contaDigital"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="contaDigital" className="ml-2 block text-sm text-gray-300">
              Registro da Conta Digital
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
