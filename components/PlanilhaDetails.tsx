"use client";

import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { DeleteRegistroButton } from "@/components/DeleteRegistroButton";
import { TipoRegistro } from "@prisma/client";
import { Pencil, List, LineChart as LineChartIcon, Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Tipos para os dados que o componente recebe
interface Registro {
  id: string;
  data: Date;
  descricao: string;
  tipo: TipoRegistro;
  valor: number;
  contaDigital: boolean;
}

interface Planilha {
  id: string;
  mes: string;
  ano: number;
  registros: Registro[];
}

interface PlanilhaDetailsProps {
  planilha: Planilha;
  entradas: number;
  saidas: number;
  saldoAnterior?: number | null;
  saldoFinal: number;
}

function StatCard({ title, value, icon, colorClass, subValue }: { title: string, value: number, icon: React.ReactNode, colorClass: string, subValue?: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>
          {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </h3>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-').replace('600', '100').replace('500', '100')}`}>
        {icon}
      </div>
    </div>
  );
}

export default function PlanilhaDetails({
  planilha,
  entradas,
  saidas,
  saldoAnterior,
  saldoFinal,
}: PlanilhaDetailsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  const saidasFixas = planilha.registros
    .filter((r) => r.tipo === TipoRegistro.SAIDA_FIXA)
    .reduce((acc, r) => acc + r.valor, 0);

  const saidasVariaveis = planilha.registros
    .filter((r) => r.tipo === TipoRegistro.SAIDA_VARIAVEL)
    .reduce((acc, r) => acc + r.valor, 0);

  const summaryData = [
    { name: "Entradas", value: entradas, fill: "#22c55e" },
    { name: "Saídas Fixas", value: saidasFixas, fill: "#ef4444" },
    { name: "Saídas Variáveis", value: saidasVariaveis, fill: "#f97316" },
  ];

  const registrosFisicos = planilha.registros.filter((r) => !r.contaDigital);
  const registrosDigitais = planilha.registros.filter((r) => r.contaDigital);

  // Process data for Line Chart
  const chartData = (() => {
    const daysInMonth = new Date(planilha.ano, ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].indexOf(planilha.mes) + 1, 0).getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayRecords = planilha.registros.filter(r => new Date(r.data).getDate() === i);
      
      const entradaFisico = dayRecords.filter(r => !r.contaDigital && r.tipo === TipoRegistro.ENTRADA).reduce((acc, r) => acc + r.valor, 0);
      const saidaFisico = dayRecords.filter(r => !r.contaDigital && r.tipo !== TipoRegistro.ENTRADA).reduce((acc, r) => acc + r.valor, 0);
      const entradaDigital = dayRecords.filter(r => r.contaDigital && r.tipo === TipoRegistro.ENTRADA).reduce((acc, r) => acc + r.valor, 0);
      const saidaDigital = dayRecords.filter(r => r.contaDigital && r.tipo !== TipoRegistro.ENTRADA).reduce((acc, r) => acc + r.valor, 0);

      if (entradaFisico > 0 || saidaFisico > 0 || entradaDigital > 0 || saidaDigital > 0) {
         data.push({
            day: i,
            entradaFisico,
            saidaFisico,
            entradaDigital,
            saidaDigital
         });
      }
    }
    return data.sort((a, b) => a.day - b.day);
  })();

  const renderRegistros = (registros: Registro[], titulo: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
      </div>
      {registros.length === 0 ? (
        <div className="p-8 text-center text-gray-500">Nenhum registro encontrado.</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {registros.map((record) => (
            <li key={record.id} className="group flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{record.descricao}</span>
                <span className="text-xs text-gray-500">
                  {new Date(record.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`font-semibold ${
                    record.tipo === TipoRegistro.ENTRADA
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {record.tipo === TipoRegistro.ENTRADA ? "+" : "-"}
                  {record.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/planilhas/${planilha.id}/registros/${record.id}/editar`}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteRegistroButton id={record.id} planilhaId={planilha.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <BackButton href="/planilhas" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 mb-8 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0b3566]">
              {planilha.mes} {planilha.ano}
            </h1>
            <p className="text-gray-600">Relatório Financeiro Detalhado</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/planilhas/${planilha.id}/saida-variavel/nova`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              - Saída Variável
            </Link>
            <Link
              href={`/planilhas/${planilha.id}/saida-fixa/nova`}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              - Saída Fixa
            </Link>
            <Link
              href={`/planilhas/${planilha.id}/entrada/nova`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              + Entrada
            </Link>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                viewMode === 'list' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List size={16} />
              Lista
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                viewMode === 'chart' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LineChartIcon size={16} />
              Gráfico
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {renderRegistros(registrosFisicos, "Registros Físicos", <Wallet className="text-gray-500" size={20} />)}
              {renderRegistros(registrosDigitais, "Registros Conta Digital", <CreditCard className="text-gray-500" size={20} />)}
            </div>

            {/* Resumo Lateral (Lista) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Mês</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Saldo Anterior</span>
                    <span className="font-semibold text-gray-900">
                      {saldoAnterior != null
                        ? saldoAnterior.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700">Entradas</span>
                    <span className="font-bold text-green-700">
                      {entradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-700">Saídas</span>
                    <span className="font-bold text-red-700">
                      {saidas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Saldo Final</span>
                    <span className={`text-xl font-bold ${saldoFinal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {saldoFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summaryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {summaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        }
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Saldo Anterior" 
                value={saldoAnterior || 0} 
                icon={<Wallet size={24} className="text-gray-600" />}
                colorClass="text-gray-700"
              />
              <StatCard 
                title="Entradas Totais" 
                value={entradas} 
                icon={<ArrowUpCircle size={24} className="text-green-600" />}
                colorClass="text-green-600"
              />
              <StatCard 
                title="Saídas Totais" 
                value={saidas} 
                icon={<ArrowDownCircle size={24} className="text-red-600" />}
                colorClass="text-red-600"
              />
              <StatCard 
                title="Saldo Final" 
                value={saldoFinal} 
                icon={<Wallet size={24} className={saldoFinal >= 0 ? "text-blue-600" : "text-red-600"} />}
                colorClass={saldoFinal >= 0 ? "text-blue-600" : "text-red-600"}
              />
            </div>

            {/* Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Evolução Financeira (Dia a Dia)</h2>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip 
                      formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="entradaFisico" name="Entrada (Físico)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="saidaFisico" name="Saída (Físico)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="entradaDigital" name="Entrada (Digital)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="saidaDigital" name="Saída (Digital)" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

