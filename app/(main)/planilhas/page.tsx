import { BackButton } from "@/components/BackButton";
import { PlusCircle, FileText } from "lucide-react";
import Link from "next/link";
import { getPlanilhas } from "./actions";
import { PlanilhaCard } from "@/components/PlanilhaCard";

export default async function PaginaPlanilhas() {
  const spreadsheets = await getPlanilhas();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <BackButton href="/dashboard" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Planilhas Financeiras
            </h1>
            <p className="text-slate-500 mt-1">
              Gerencie as entradas e saídas mensais
            </p>
          </div>

          <Link
            href="/planilhas/nova"
            className="mt-4 sm:mt-0 bg-[#0b3566] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#072646] transition-all shadow-md hover:shadow-lg font-medium whitespace-nowrap active:scale-95 duration-200"
          >
            <PlusCircle size={20} />
            Nova Planilha
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {spreadsheets.map((sheet) => (
            <PlanilhaCard
              key={sheet.id}
              id={sheet.id}
              mes={sheet.mes}
              ano={sheet.ano}
            />
          ))}

          {/* Empty State if no spreadsheets */}
          {spreadsheets.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FileText size={40} className="text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                Nenhuma planilha encontrada.
              </p>
              <p className="text-slate-500 max-w-sm mx-auto">
                Crie uma nova planilha para começar a gerenciar suas finanças.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
