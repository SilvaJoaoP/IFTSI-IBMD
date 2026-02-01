import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { createUserAction, deleteUserAction } from "./actions";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import {
  Shield,
  UserPlus,
  Users,
  Trash2,
  Edit,
  Mail,
  IdCard,
} from "lucide-react";

function DeleteUserButton({ id }: { id: string }) {
  const deleteUserWithId = async () => {
    "use server";
    await deleteUserAction(id);
    revalidatePath("/gestao-cargos");
  };
  return (
    <form action={deleteUserWithId}>
      <button
        type="submit"
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Deletar usuário"
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}

export default async function PaginaGestaoCargos() {
  const session = await auth();
  if (session?.user?.cargo !== Role.PASTOR) {
    redirect("/dashboard");
  }

  const usuarios = await prisma.user.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Gestão de Cargos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie usuários, permissões e acessos ao sistema.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formulário de Criação */}
        <div className="xl:col-span-1 h-fit">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-slate-200/50 sticky top-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-[#0b3566]">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Novo Usuário
                </h2>
                <p className="text-slate-500 text-sm">Cadastrar novo membro</p>
              </div>
            </div>

            <form action={createUserAction} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="nome"
                  className="text-sm font-bold text-slate-700"
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nome"
                    required
                    placeholder="Ex: João da Silva"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                  />
                  <Users
                    className="absolute left-3 top-3.5 text-slate-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-slate-700"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="usuario@exemplo.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                  />
                  <Mail
                    className="absolute left-3 top-3.5 text-slate-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="cpf"
                    className="text-sm font-bold text-slate-700"
                  >
                    CPF{" "}
                    <span className="text-slate-400 font-normal">(Op.)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cpf"
                      placeholder="000.000.000-00"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                    />
                    <IdCard
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={18}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cargo"
                    className="text-sm font-bold text-slate-700"
                  >
                    Cargo
                  </label>
                  <div className="relative">
                    <select
                      name="cargo"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                    >
                      {Object.values(Role).map((cargo) => (
                        <option key={cargo} value={cargo}>
                          {cargo}
                        </option>
                      ))}
                    </select>
                    <Shield
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={18}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="senha"
                  className="text-sm font-bold text-slate-700"
                >
                  Senha Provisória
                </label>
                <input
                  type="password"
                  name="senha"
                  required
                  placeholder="********"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0b3566] hover:bg-[#092b52] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                <UserPlus size={20} />
                CRIAR USUÁRIO
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Usuários Cadastrados
                </h2>
                <p className="text-slate-500 text-sm">
                  {usuarios.length} registros encontrados
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Users className="text-slate-400" size={20} />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {usuarios.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors group gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100">
                      {user.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        {user.nome}
                        <span
                          className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                            user.cargo === "PASTOR"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : user.cargo === "ADMIN"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.cargo}
                        </span>
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-16 md:pl-0">
                    <Link
                      href={`/gestao-cargos/${user.id}/edit`}
                      className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors border border-blue-100 hover:border-blue-600"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </Link>
                    <DeleteUserButton id={user.id} />
                  </div>
                </div>
              ))}
            </div>

            {usuarios.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-slate-500">Nenhum usuário cadastrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
