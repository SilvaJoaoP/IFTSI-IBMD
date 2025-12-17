import { BackButton } from "@/components/BackButton";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getPlanilhas } from "./actions";
import { PlanilhaCard } from "@/components/PlanilhaCard";

export default async function PaginaPlanilhas() {
  const spreadsheets = await getPlanilhas();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <BackButton href="/dashboard" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 mb-8 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0b3566]">Planilhas Financeiras</h1>
            <p className="text-lg text-gray-600 mt-1">
              Gerencie as entradas e saídas mensais
            </p>
          </div>
          
          <Link
            href="/planilhas/nova"
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
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
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-lg">Nenhuma planilha encontrada.</p>
              <p className="text-sm">Crie uma nova para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
