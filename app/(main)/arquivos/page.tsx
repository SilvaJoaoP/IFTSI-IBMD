"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Filter, Plus, Folder, Upload } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const pastas = [
  { id: 1, nome: "Financeiro" },
  { id: 2, nome: "Mídia" },
  { id: 3, nome: "Ensino" },
  { id: 4, nome: "Eventos" },
  { id: 5, nome: "Contratos" },
];

const baseDeArquivos = [
  { id: 1, pId: 1, nome: "Planilha de Dízimos", tipo: "XLSX", data: "10/12/2025" },
  { id: 2, pId: 2, nome: "Vídeo de Abertura", tipo: "MP4", data: "05/12/2025" },
  { id: 3, pId: 3, nome: "Material EBD Infantil", tipo: "PDF", data: "01/12/2025" },
  { id: 4, pId: 4, nome: "Lista de Inscritos - Congresso", tipo: "PDF", data: "14/12/2025" },
  { id: 5, pId: 5, nome: "Contrato da Segurança", tipo: "PDF", data: "30/09/2025" },
  { id: 6, pId: 5, nome: "Contrato de Geradores", tipo: "PNG", data: "26/09/2025" },
];

export default function PaginaArquivos() {
  const [pastaSelecionada, setPastaSelecionada] = useState(5);
  const [busca, setBusca] = useState("");

  // Filtra por pasta e por termo de busca simultaneamente
  const arquivosExibidos = useMemo(() => {
    return baseDeArquivos.filter(arq => 
      arq.pId === pastaSelecionada && 
      arq.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [pastaSelecionada, busca]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="mb-4">
          <BackButton href="/dashboard" />
        </div>

        {/* Cabeçalho*/}
        <header className="flex justify-between items-start mb-10">
          <div className="flex flex-col items-center">
            <Image src="/logoSemFundo.png" alt="Logo" width={130} height={45} priority className="object-contain" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800">Nome do usuário</p>
              <p className="text-[10px] text-gray-500">Secretário</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-sm cursor-pointer">
              <img src="https://github.com/shadcn.png" alt="Perfil" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Barra de Título e Pesquisa */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <h1 className="text-xl font-bold text-gray-900">Documentos</h1>
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisa Rápida"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 bg-gray-100/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <Filter size={18} className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => alert("Criar Novo")}
                className="flex items-center gap-1 bg-[#1A73E8] hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-6 py-1.5 rounded transition-all shadow-sm cursor-pointer"
              >
                <Plus size={16} /> NOVO
              </button>
              
              <button 
                onClick={() => alert("Fazer Upload")}
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 active:scale-95 text-[#1A73E8] text-sm font-bold px-6 py-1.5 rounded border border-gray-300 transition-all cursor-pointer shadow-sm"
              >
                <Upload size={16} /> UPLOAD
              </button>
            </div>
          </div>
        </div>

        {/* Card de Documentos */}
        <main className="bg-white rounded-[30px] shadow-2xl p-8 min-h-[500px] border border-gray-100">
          
          {/* Listagem de Pastas */}
          <div className="flex flex-wrap gap-8 mb-10 border-b border-gray-50 pb-6">
            {pastas.map((pasta) => (
              <div 
                key={pasta.id}
                onClick={() => setPastaSelecionada(pasta.id)}
                className={`flex flex-col items-center gap-2 cursor-pointer group transition-all duration-300 ${
                  pastaSelecionada === pasta.id ? "scale-105 opacity-100" : "opacity-30 grayscale hover:opacity-80 hover:grayscale-0"
                }`}
              >
                <Folder 
                  size={64} 
                  className={pastaSelecionada === pasta.id ? "text-[#C5A065] fill-[#D4AF37]" : "text-gray-400 fill-gray-100"} 
                  strokeWidth={1} 
                />
                <span className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${
                  pastaSelecionada === pasta.id ? "text-blue-900" : "text-gray-400"
                }`}>
                  {pasta.nome}
                </span>
              </div>
            ))}
          </div>

          {/* Tabela de Arquivos */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0e4e82] text-white text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 pl-8 pr-4 rounded-tl-lg w-16">#</th>
                  <th className="py-3 px-4">Nome do Documento</th>
                  <th className="py-3 px-4">Tipo de Arquivo</th>
                  <th className="py-3 px-4 rounded-tr-lg">Data de Modificação</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {arquivosExibidos.length > 0 ? (
                  arquivosExibidos.map((arquivo, index) => (
                    <tr 
                      key={arquivo.id} 
                      onClick={() => alert(`Abrindo ${arquivo.nome}...`)}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 group hover:bg-blue-50 transition-colors cursor-pointer`}
                    >
                      <td className="py-3 pl-8 pr-4 font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-400 group-hover:text-blue-900 transition-colors">
                        {arquivo.nome}
                      </td>
                      <td className="py-3 px-4 text-gray-400/70 group-hover:text-gray-700 transition-colors">
                        {arquivo.tipo}
                      </td>
                      <td className="py-3 px-4 text-gray-400/70 group-hover:text-gray-700 transition-colors">
                        {arquivo.data}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-gray-400 italic">
                      Nenhum documento encontrado nesta pasta ou pesquisa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}