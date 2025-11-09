import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { createUserAction, deleteUserAction } from "./actions";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

function DeleteUserButton({ id }: { id: string }) {
  const deleteUserWithId = async () => {
    "use server";
    await deleteUserAction(id);
    revalidatePath("/gestao-cargos");
  };
  return (
    <form action={deleteUserWithId}>
      <button type="submit" className="text-red-500 hover:text-red-700">
        Deletar
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
    <div className="p-8 max-w-4xl mx-auto">
      <BackButton href="/dashboard" />

      <h1 className="text-3xl font-bold mb-8">Gestão de Cargos e Usuários</h1>

      {}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Usuário</h2>
        <form action={createUserAction} className="space-y-4">
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
              >
                {}
                {Object.values(Role).map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Senha Provisória
            </label>
            <input
              type="password"
              name="senha"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Criar Usuário
          </button>
        </form>
      </div>

      {}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Usuários Cadastrados</h2>
        <ul className="space-y-3">
          {usuarios.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">
                  {user.nome}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    ({user.cargo})
                  </span>
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Link
                  href={`/gestao-cargos/${user.id}/edit`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Editar
                </Link>
              </div>
              <DeleteUserButton id={user.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
