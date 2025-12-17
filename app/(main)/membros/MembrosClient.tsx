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
    m.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const otherMembros = membros.filter(
    (m) => !m.nome.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Relatório de Membros</h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Barra de Pesquisa */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar membro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de Cards */}
      {displayList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <User size={48} className="mb-4 text-gray-400" />
          <p className="text-lg font-medium">Nenhum membro encontrado</p>
          <p className="text-sm">Clique em "Adicionar Membro" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map((membro) => {
            // Verifica se é um resultado da busca para destacar
            const isMatch =
              searchTerm &&
              membro.nome.toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div
                key={membro.id}
                className={`bg-white p-4 rounded shadow border transition-all ${
                  isMatch
                    ? "border-blue-500 ring-2 ring-blue-100 shadow-md"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-full ${
                      isMatch ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <User
                      size={24}
                      className={isMatch ? "text-blue-600" : "text-gray-600"}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{membro.nome}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        membro.situacao === "MEMBRO"
                          ? "bg-green-100 text-green-800"
                          : membro.situacao === "CONGREGADO"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {membro.situacao}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-medium">CPF:</span>{" "}
                    {membro.cpf || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Tel:</span>{" "}
                    {membro.telefone || "-"}
                  </p>
                </div>

                <div className="flex justify-between mt-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(membro.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedMembro(membro)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    Ver mais <Eye size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Adicionar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-gray-900">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">Novo Membro</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <form action={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    name="nome"
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    CPF
                  </label>
                  <input
                    name="cpf"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold mt-2 text-gray-800 border-b pb-1">
                    Endereço
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Rua
                  </label>
                  <input
                    name="rua"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Número
                  </label>
                  <input
                    name="numero"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Bairro
                  </label>
                  <input
                    name="bairro"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Estado
                  </label>
                  <input
                    name="estado"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>

                {/* Situação */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Situação
                  </label>
                  <select
                    name="situacao"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  >
                    <option value="MEMBRO">Membro</option>
                    <option value="CONGREGADO">Congregado</option>
                    <option value="AFASTADO">Afastado</option>
                  </select>
                </div>

                {/* Correlação Inicial (Opcional) */}
                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Vínculo Familiar (Opcional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Parente (Membro Existente)
                      </label>
                      <select
                        name="parenteId"
                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                      >
                        <option value="">Selecione...</option>
                        {membros.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        É o que do novo membro?
                      </label>
                      <select
                        name="tipoParentesco"
                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-gray-900">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">Editar Membro</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="id" value={editingMembro.id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    name="nome"
                    defaultValue={editingMembro.nome}
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    CPF
                  </label>
                  <input
                    name="cpf"
                    defaultValue={editingMembro.cpf || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingMembro.email || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    defaultValue={editingMembro.telefone || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold mt-2 text-gray-800 border-b pb-1">
                    Endereço
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Rua
                  </label>
                  <input
                    name="rua"
                    defaultValue={editingMembro.rua || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Número
                  </label>
                  <input
                    name="numero"
                    defaultValue={editingMembro.numero || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Bairro
                  </label>
                  <input
                    name="bairro"
                    defaultValue={editingMembro.bairro || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    defaultValue={editingMembro.cidade || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Estado
                  </label>
                  <input
                    name="estado"
                    defaultValue={editingMembro.estado || ""}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>

                {/* Situação */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Situação
                  </label>
                  <select
                    name="situacao"
                    defaultValue={editingMembro.situacao}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                  >
                    <option value="MEMBRO">Membro</option>
                    <option value="CONGREGADO">Congregado</option>
                    <option value="AFASTADO">Afastado</option>
                  </select>
                </div>

                {/* Gerenciar Vínculos */}
                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Vínculos Familiares
                  </h3>

                  {/* Lista de Vínculos Existentes */}
                  {(editingMembro.parentesOrigem.length > 0 ||
                    editingMembro.parentesDestino.length > 0) && (
                    <ul className="mb-4 space-y-2">
                      {editingMembro.parentesOrigem.map((p: any) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm"
                        >
                          <span>
                            <span className="font-semibold">
                              {tipoParentescoMap[p.tipo] || p.tipo}
                            </span>{" "}
                            de {p.membroDestino.nome}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteParentesco(p.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remover vínculo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </li>
                      ))}
                      {editingMembro.parentesDestino.map((p: any) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm"
                        >
                          <span>
                            <span className="font-semibold">
                              {p.membroOrigem.nome}
                            </span>{" "}
                            é {tipoParentescoMap[p.tipo] || p.tipo}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteParentesco(p.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remover vínculo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Adicionar Novo Vínculo */}
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Adicionar Novo Vínculo
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">
                          Parente (Membro Existente)
                        </label>
                        <select
                          name="parenteId"
                          className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
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
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">
                          É o que deste membro?
                        </label>
                        <select
                          name="tipoParentesco"
                          className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-gray-900">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedMembro.nome}
              </h2>
              <button
                onClick={() => setSelectedMembro(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-1">
                  Dados Pessoais
                </h3>
                <p>
                  <span className="font-medium text-gray-600">CPF:</span>{" "}
                  {selectedMembro.cpf || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Email:</span>{" "}
                  {selectedMembro.email || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Telefone:</span>{" "}
                  {selectedMembro.telefone || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Situação:</span>{" "}
                  <span className="font-medium">{selectedMembro.situacao}</span>
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-1">
                  Endereço
                </h3>
                <p>
                  {selectedMembro.rua || "Rua não informada"},{" "}
                  {selectedMembro.numero || "S/N"}
                </p>
                <p>{selectedMembro.bairro || "Bairro não informado"}</p>
                <p>
                  {selectedMembro.cidade || "Cidade não informada"} -{" "}
                  {selectedMembro.estado || "UF"}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Familiares / Vínculos
              </h3>
              {selectedMembro.parentesOrigem.length === 0 &&
              selectedMembro.parentesDestino.length === 0 ? (
                <p className="text-gray-500 italic bg-gray-50 p-3 rounded">
                  Nenhum vínculo cadastrado.
                </p>
              ) : (
                <ul className="space-y-2">
                  {selectedMembro.parentesOrigem.map((p: any) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 bg-blue-50 p-2 rounded text-blue-900"
                    >
                      <span className="font-semibold">
                        {tipoParentescoMap[p.tipo] || p.tipo}
                      </span>{" "}
                      de {p.membroDestino.nome}
                    </li>
                  ))}
                  {selectedMembro.parentesDestino.map((p: any) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 bg-blue-50 p-2 rounded text-blue-900"
                    >
                      <span className="font-semibold">
                        {p.membroOrigem.nome}
                      </span>{" "}
                      é {tipoParentescoMap[p.tipo] || p.tipo}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex justify-between pt-4 border-t">
              <button
                onClick={() => openEditModal(selectedMembro)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit size={16} /> Editar
              </button>
              <button
                onClick={() => setSelectedMembro(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
