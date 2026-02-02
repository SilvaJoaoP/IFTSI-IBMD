import { BackButton } from "@/components/BackButton";
import { createPlanilha } from "../actions";

export default function NovaPlanilhaPage() {
  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/planilhas" />
      </div>

      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Criar Nova Planilha
        </h1>
        <p className="text-slate-500 mb-8">
          Defina o mês e o ano para iniciar o controle financeiro.
        </p>

        <form action={createPlanilha} className="space-y-6">
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Mês Referência
            </label>
            <input
              type="text"
              id="month"
              name="month"
              className="w-full border border-gray-200 rounded-xl p-3 text-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
              placeholder="Ex: Janeiro"
              required
            />
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Ano Referência
            </label>
            <input
              type="number"
              id="year"
              name="year"
              className="w-full border border-gray-200 rounded-xl p-3 text-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
              placeholder="Ex: 2025"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0b3566] hover:bg-[#072646] text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 duration-200 mt-4"
          >
            Criar Planilha
          </button>
        </form>
      </div>
    </div>
  );
}
