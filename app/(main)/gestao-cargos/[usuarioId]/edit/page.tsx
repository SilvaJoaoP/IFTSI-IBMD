import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { updateUserAction } from "../../actions";
import { BackButton } from "@/components/BackButton";
import { Shield, User, Mail, IdCard, Save, UserCog, Lock } from "lucide-react";

export default async function PaginaEditarUsuario(props: {
  params: Promise<{ usuarioId: string }>;
}) {
  const { usuarioId } = await props.params;

  const session = await auth();
  if (session?.user?.cargo !== Role.PASTOR) {
    redirect("/dashboard");
  }

  const usuario = await prisma.user.findUnique({
    where: { id: usuarioId },
  });

  if (!usuario) {
    console.warn("⚠️ Usuário não encontrado para ID:", usuarioId);
    redirect("/gestao-cargos");
  }

  const updateUserWithId = updateUserAction.bind(null, usuario.id);

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/gestao-cargos" />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0b3566]/10 text-[#0b3566] rounded-3xl flex items-center justify-center mx-auto mb-4">
            <UserCog size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Editar Usuário
          </h1>
          <p className="text-slate-500 mt-2">
            Atualize as informações e permissões de {usuario.nome}.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-slate-200/50">
          <form action={updateUserWithId} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="nome"
                className="text-sm font-bold text-slate-700"
              >
                Nome
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nome"
                  required
                  defaultValue={usuario.nome}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                />
                <User
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
                  defaultValue={usuario.email}
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
                  CPF <span className="text-slate-400 font-normal">(Op.)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cpf"
                    defaultValue={usuario.cpf || ""}
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
                    defaultValue={usuario.cargo}
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

            <hr className="border-gray-100" />

            <div className="space-y-2">
              <label
                htmlFor="senha"
                className="text-sm font-bold text-slate-700"
              >
                Nova Senha{" "}
                <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="senha"
                  placeholder="Deixe em branco para manter"
                  className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                />
                <Lock
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0b3566] hover:bg-[#092b52] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
            >
              <Save size={20} />
              SALVAR ALTERAÇÕES
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
