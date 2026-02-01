"use client";

import { useState } from "react";
import {
  createMembro,
  deleteMembro,
  updateMembro,
  deleteParentesco,
} from "./actions";
import { Plus, Trash2, User, Eye, X, Edit, Search } from "lucide-react";
import type { Prisma } from "@prisma/client";

const tipoParentescoMap: Record<string, string> = {
  PAI: "Pai",
  MAE: "Mãe",
  FILHO: "Filho",
  FILHA: "Filha",
  ESPOSO: "Esposo",
  ESPOSA: "Esposa",
  IRMAO: "Irmão",
  IRMA: "Irmã",
  OUTRO: "Outro",
};

// Tipos (idealmente viriam do Prisma ou de um arquivo de tipos)
type Membro = Prisma.MembroGetPayload<{
  include: {
    parentesOrigem: {
      include: {
        membroDestino: true;
      };
    };
    parentesDestino: {
      include: {
        membroOrigem: true;
      };
    };
  };
}>;

export default function MembrosClient({
  initialMembros,
}: {
  initialMembros: Membro[];
}) {
  const [membros, setMembros] = useState(initialMembros);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState<Membro | null>(null);
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de busca: separa os que dão match dos que não dão
  const filteredMembros = membros.filter((m) =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const otherMembros = membros.filter(
    (m) => !m.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Se tiver busca, mostra primeiro os filtrados, depois os outros
  // Se não tiver busca, mostra a lista original (que já deve vir ordenada do back)
  const displayList = searchTerm
    ? [...filteredMembros, ...otherMembros]
    : membros;

  async function handleCreate(formData: FormData) {
    setIsLoading(true);
    const res = await createMembro(formData);
    if (res.success) {
      setIsAddModalOpen(false);
      window.location.reload();
    } else {
      alert(res.message);
    }
    setIsLoading(false);
  }

  async function handleUpdate(formData: FormData) {
    setIsLoading(true);
    const res = await updateMembro(formData);
    if (res.success) {
      setIsEditModalOpen(false);
      setEditingMembro(null);
      window.location.reload();
    } else {
      alert(res.message);
    }
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return;
    await deleteMembro(id);
    window.location.reload();
  }

  async function handleDeleteParentesco(id: string) {
    if (!confirm("Remover este vínculo?")) return;
    await deleteParentesco(id);
    window.location.reload();
  }

  function openEditModal(membro: Membro) {
    setEditingMembro(membro);
    setSelectedMembro(null);
    setIsEditModalOpen(true);
  }

  return (
    <div>
      {/* Header e Botão Adicionar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Membros
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie o cadastro de membros e congregados.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Barra de Pesquisa */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-full w-full focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none bg-white text-gray-900 transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0b3566] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#072646] transition-all shadow-md hover:shadow-lg font-medium whitespace-nowrap active:scale-95 duration-200"
          >
            <Plus size={20} />
            Novo Membro
          </button>
        </div>
      </div>

      {/* Lista de Cards */}
      {displayList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <User size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nenhum membro encontrado
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Não encontramos registros com os critérios atuais. Tente uma nova
            busca ou adicione um novo membro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayList.map((membro) => {
            // Verifica se é um resultado da busca para destacar
            const isMatch =
              searchTerm &&
              membro.nome.toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div
                key={membro.id}
                className={`group bg-white p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                  isMatch
                    ? "border-blue-300 ring-4 ring-blue-50 shadow-lg"
                    : "border-gray-100 hover:border-blue-100 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${
                        isMatch
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white"
                      }`}
                    >
                      {membro.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">
                        {membro.nome}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          membro.situacao === "MEMBRO"
                            ? "bg-emerald-100 text-emerald-700"
                            : membro.situacao === "CONGREGADO"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {membro.situacao}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-500 mb-6 bg-slate-50/50 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">CPF</span>
                    <span className="font-mono text-slate-700">
                      {membro.cpf || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Contato</span>
                    <span className="font-mono text-slate-700">
                      {membro.telefone || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedMembro(membro)}
                    className="flex-1 bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={18} /> Detalhes
                  </button>
                  <button
                    onClick={() => handleDelete(membro.id)}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Adicionar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl text-gray-900 border border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Novo Membro
                </h2>
                <p className="text-slate-500 text-sm">
                  Preencha os dados abaixo para cadastrar
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form action={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nome"
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all placeholder:text-slate-400 font-medium"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    CPF
                  </label>
                  <input
                    name="cpf"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                {/* Situação */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Situação
                  </label>
                  <div className="relative">
                    <select
                      name="situacao"
                      className="w-full border border-gray-200 rounded-xl p-3 pr-10 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium cursor-pointer"
                    >
                      <option value="MEMBRO">Membro</option>
                      <option value="CONGREGADO">Congregado</option>
                      <option value="AFASTADO">Afastado</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="md:col-span-2 pt-2">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                    Endereço
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Rua
                  </label>
                  <input
                    name="rua"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Número
                  </label>
                  <input
                    name="numero"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Bairro
                  </label>
                  <input
                    name="bairro"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Estado
                  </label>
                  <input
                    name="estado"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>

                {/* Correlação Inicial (Opcional) */}
                <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Vínculo Familiar{" "}
                    <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-2">
                      Opcional
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Parente (Membro Existente)
                      </label>
                      <div className="relative">
                        <select
                          name="parenteId"
                          className="w-full border border-gray-200 rounded-xl p-3 pr-10 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-white text-slate-800 transition-all cursor-pointer"
                        >
                          <option value="">Selecione...</option>
                          {membros.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.nome}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        É o que do novo membro?
                      </label>
                      <div className="relative">
                        <select
                          name="tipoParentesco"
                          className="w-full border border-gray-200 rounded-xl p-3 pr-10 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-white text-slate-800 transition-all cursor-pointer"
                        >
                          <option value="">Selecione...</option>
                          <option value="PAI">Pai</option>
                          <option value="MAE">Mãe</option>
                          <option value="FILHO">Filho</option>
                          <option value="FILHA">Filha</option>
                          <option value="ESPOSO">Esposo</option>
                          <option value="ESPOSA">Esposa</option>
                          <option value="IRMAO">Irmão</option>
                          <option value="IRMA">Irmã</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#0b3566] text-white rounded-xl font-semibold hover:bg-[#072646] transition-colors disabled:opacity-50 shadow-lg shadow-blue-900/20"
                >
                  {isLoading ? "Salvando..." : "Salvar Membro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {isEditModalOpen && editingMembro && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl text-gray-900 border border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Editar Membro
                </h2>
                <p className="text-slate-500 text-sm">
                  Atualize as informações de {editingMembro.nome}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form action={handleUpdate} className="space-y-6">
              <input type="hidden" name="id" value={editingMembro.id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nome"
                    defaultValue={editingMembro.nome}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    CPF
                  </label>
                  <input
                    name="cpf"
                    defaultValue={editingMembro.cpf || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingMembro.email || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    defaultValue={editingMembro.telefone || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2 pt-2">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                    Endereço
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Rua
                  </label>
                  <input
                    name="rua"
                    defaultValue={editingMembro.rua || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Número
                  </label>
                  <input
                    name="numero"
                    defaultValue={editingMembro.numero || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Bairro
                  </label>
                  <input
                    name="bairro"
                    defaultValue={editingMembro.bairro || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    defaultValue={editingMembro.cidade || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Estado
                  </label>
                  <input
                    name="estado"
                    defaultValue={editingMembro.estado || ""}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium"
                  />
                </div>

                {/* Situação */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Situação
                  </label>
                  <div className="relative">
                    <select
                      name="situacao"
                      defaultValue={editingMembro.situacao}
                      className="w-full border border-gray-200 rounded-xl p-3 pr-10 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-slate-50 text-slate-800 transition-all font-medium cursor-pointer"
                    >
                      <option value="MEMBRO">Membro</option>
                      <option value="CONGREGADO">Congregado</option>
                      <option value="AFASTADO">Afastado</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Gerenciar Vínculos */}
                <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Vínculos Familiares
                  </h3>

                  {/* Lista de Vínculos Existentes */}
                  {(editingMembro.parentesOrigem.length > 0 ||
                    editingMembro.parentesDestino.length > 0) && (
                    <ul className="mb-6 space-y-3">
                      {editingMembro.parentesOrigem.map((p: any) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-xl shadow-sm"
                        >
                          <span className="text-slate-600 text-sm">
                            <span className="font-bold text-slate-800">
                              {tipoParentescoMap[p.tipo] || p.tipo}
                            </span>{" "}
                            de {p.membroDestino.nome}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteParentesco(p.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Remover vínculo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                      {editingMembro.parentesDestino.map((p: any) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-xl shadow-sm"
                        >
                          <span className="text-slate-600 text-sm">
                            <span className="font-bold text-slate-800">
                              {p.membroOrigem.nome}
                            </span>{" "}
                            é {tipoParentescoMap[p.tipo] || p.tipo}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteParentesco(p.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Remover vínculo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Adicionar Novo Vínculo */}
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    <p className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Plus size={16} className="text-blue-600" />
                      Adicionar Novo Vínculo
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-slate-600 uppercase tracking-wide">
                          Parente
                        </label>
                        <div className="relative">
                          <select
                            name="parenteId"
                            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm pr-10 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-white text-slate-800 transition-all cursor-pointer"
                          >
                            <option value="">Selecione...</option>
                            {membros
                              .filter((m) => m.id !== editingMembro.id)
                              .map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.nome}
                                </option>
                              ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-slate-600 uppercase tracking-wide">
                          Relação
                        </label>
                        <div className="relative">
                          <select
                            name="tipoParentesco"
                            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm pr-10 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none bg-white text-slate-800 transition-all cursor-pointer"
                          >
                            <option value="">Selecione...</option>
                            <option value="PAI">Pai</option>
                            <option value="MAE">Mãe</option>
                            <option value="FILHO">Filho</option>
                            <option value="FILHA">Filha</option>
                            <option value="ESPOSO">Esposo</option>
                            <option value="ESPOSA">Esposa</option>
                            <option value="IRMAO">Irmão</option>
                            <option value="IRMA">Irmã</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#0b3566] text-white rounded-xl font-semibold hover:bg-[#072646] transition-colors disabled:opacity-50 shadow-lg shadow-blue-900/20"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {selectedMembro && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl text-gray-900 border border-gray-100 relative">
            {/* Background Decorativo no Topo */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-3xl -z-0"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-800 border-4 border-white">
                    {selectedMembro.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white mt-2">
                    <h2 className="text-2xl font-bold leading-tight drop-shadow-sm">
                      {selectedMembro.nome}
                    </h2>
                    <p className="opacity-90 text-sm font-medium">
                      #{selectedMembro.id.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMembro(null)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-8 bg-white rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <User size={18} className="text-blue-600" />
                      Dados Pessoais
                    </h3>
                    <div className="space-y-3 pl-2">
                      <div className="flex items-center justify-between group">
                        <span className="text-slate-500 font-medium">CPF</span>
                        <span className="font-mono text-slate-800 bg-slate-50 px-2 py-0.5 rounded">
                          {selectedMembro.cpf || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="text-slate-500 font-medium">
                          Email
                        </span>
                        <span className="text-slate-800">
                          {selectedMembro.email || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="text-slate-500 font-medium">
                          Telefone
                        </span>
                        <span className="font-mono text-slate-800">
                          {selectedMembro.telefone || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="text-slate-500 font-medium">
                          Situação
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-sm ${
                            selectedMembro.situacao === "MEMBRO"
                              ? "bg-emerald-100 text-emerald-700"
                              : selectedMembro.situacao === "CONGREGADO"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {selectedMembro.situacao}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                        📍
                      </div>
                      Endereço
                    </h3>
                    <div className="space-y-1 pl-2 text-slate-700">
                      <p className="font-medium text-lg">
                        {selectedMembro.rua || "Rua não informada"},{" "}
                        {selectedMembro.numero || "S/N"}
                      </p>
                      <p className="text-slate-500">
                        {selectedMembro.bairro || "Bairro não informado"}
                      </p>
                      <p className="text-slate-500">
                        {selectedMembro.cidade || "Cidade não informada"} -{" "}
                        {selectedMembro.estado || "UF"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <User size={18} className="text-amber-500" />
                    Familiares / Vínculos
                  </h3>
                  {selectedMembro.parentesOrigem.length === 0 &&
                  selectedMembro.parentesDestino.length === 0 ? (
                    <div className="text-slate-500 italic bg-slate-50 p-4 rounded-2xl text-center border border-dashed border-gray-200">
                      <p>Nenhum vínculo familiar cadastrado.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedMembro.parentesOrigem.map((p: any) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-xl shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {p.membroDestino.nome.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                              {tipoParentescoMap[p.tipo] || p.tipo} de
                            </span>
                            <span className="font-bold text-slate-800">
                              {p.membroDestino.nome}
                            </span>
                          </div>
                        </div>
                      ))}
                      {selectedMembro.parentesDestino.map((p: any) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-xl shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {p.membroOrigem.nome.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">
                              {p.membroOrigem.nome}
                            </span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                              é {tipoParentescoMap[p.tipo] || p.tipo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedMembro(null)}
                    className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => openEditModal(selectedMembro)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/20"
                  >
                    <Edit size={18} /> Editar Membro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
