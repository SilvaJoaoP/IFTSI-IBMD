"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, Edit2, FileSpreadsheet } from "lucide-react";
import { deletePlanilha, renamePlanilha } from "@/app/(main)/planilhas/actions";

interface PlanilhaCardProps {
  id: string;
  mes: string;
  ano: number;
}

export function PlanilhaCard({ id, mes, ano }: PlanilhaCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newMes, setNewMes] = useState(mes);
  const [newAno, setNewAno] = useState(ano);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja excluir a planilha de ${mes}/${ano}?`)) {
      await deletePlanilha(id);
    }
    setIsMenuOpen(false);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    await renamePlanilha(id, newMes, newAno);
    setIsRenameModalOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden flex flex-col">
        {/* Card Image Area (Google Sheets Style) */}
        <Link href={`/planilhas/${id}`} className="block h-40 bg-gray-50 relative border-b border-gray-100 group-hover:bg-blue-50/30 transition-colors">
           <div className="absolute inset-0 flex items-center justify-center">
              <FileSpreadsheet className="w-16 h-16 text-green-600 opacity-80 group-hover:scale-110 transition-transform duration-300" />
           </div>
        </Link>

        {/* Card Content */}
        <div className="p-4 flex items-center justify-between bg-white">
          <Link href={`/planilhas/${id}`} className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {mes} {ano}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Planilha Financeira
            </p>
          </Link>

          {/* Kebab Menu */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none"
            >
              <MoreVertical size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100 origin-bottom-right">
                <button
                  onClick={() => {
                    setIsRenameModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Renomear
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Renomear Planilha</h2>
            <form onSubmit={handleRename}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                  <select
                    value={newMes}
                    onChange={(e) => setNewMes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {[
                      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                  <input
                    type="number"
                    value={newAno}
                    onChange={(e) => setNewAno(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
