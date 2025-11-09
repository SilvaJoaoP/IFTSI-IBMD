import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { updateUserAction } from "../../actions";
import { BackButton } from "@/components/BackButton";

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
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <BackButton href="/gestao-cargos" />
      </div>

      <h1 className="text-3xl font-bold mb-8">Editar Usuário</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form action={updateUserWithId} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                type="text"
                name="nome"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue={usuario.nome}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue={usuario.email}
              />
            </div>

            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700"
              >
                CPF (Opcional)
              </label>
              <input
                type="text"
                name="cpf"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue={usuario.cpf || ""}
              />
            </div>

            <div>
              <label
                htmlFor="cargo"
                className="block text-sm font-medium text-gray-700"
              >
                Cargo
              </label>
              <select
                name="cargo"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue={usuario.cargo}
              >
                {Object.values(Role).map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr />

          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Nova Senha (Opcional)
            </label>
            <p className="text-xs text-gray-500">
              Deixe em branco para não alterar a senha.
            </p>
            <input
              type="password"
              name="senha"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Atualizar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}
