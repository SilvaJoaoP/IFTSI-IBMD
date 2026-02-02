import { BackButton } from "@/components/BackButton";
import { createPlanilha } from "../actions";

export default function NovaPlanilhaPage() {
  return (
    <div>
      <BackButton href="/planilhas" />
      <h1 className="text-3xl font-bold mb-6">Criar Nova Planilha</h1>

      <form action={createPlanilha} className="max-w-md">
        <div className="mb-4">
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700"
          >
            Mês
          </label>
          <input
            type="text"
            id="month"
            name="month"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ex: Janeiro"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Ano
          </label>
          <input
            type="number"
            id="year"
            name="year"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ex: 2025"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Criar Planilha
        </button>
      </form>
    </div>
  );
}
