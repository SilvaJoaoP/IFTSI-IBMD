import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

function ProfileIcon() {
  return (
    <Link
      href="/perfil"
      className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600"
    >
      {}P
    </Link>
  );
}

function AcessoBlock({
  href,
  title,
  color,
  icon,
}: {
  href: string;
  title: string;
  color: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className={`p-4 rounded-lg shadow-md text-white font-semibold flex flex-col justify-between h-28 ${color}`}
    >
      <span className="text-3xl">{icon}</span>
      {title}
    </Link>
  );
}

export default async function PaginaDashboard() {
  const session = await auth();

  if (!session?.user?.cargo) {
    redirect("/");
  }

  const userRole = session.user.cargo as Role;

  const permissions = getPermissionsForRole(userRole);

  return (
    <div className="p-6">
      {}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Monte de Deus</h1>
          <p className="text-gray-500">
            Bem-vindo, {session.user.nome || "Usuário"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Pesquisa Rápida"
            className="px-4 py-2 border rounded-full w-72"
          />
          <ProfileIcon />
          <LogoutButton />
        </div>
      </header>

      {}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Suas permissões de acesso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {}

          {permissions.canSeeRelatorioFinanceiro && (
            <AcessoBlock
              href="/planilhas"
              title="Relatório financeiro"
              color="bg-blue-600"
              icon="📊"
            />
          )}
          {permissions.canSeeRelatorioMembros && (
            <AcessoBlock
              href="/membros"
              title="Relatório de membros"
              color="bg-blue-600"
              icon="👥"
            />
          )}
          {permissions.canSeeDocumentos && (
            <AcessoBlock
              href="/arquivos"
              title="Documentos"
              color="bg-blue-600"
              icon="📁"
            />
          )}
          {permissions.canSeeCalendarioAnual && (
            <AcessoBlock
              href="/calendario"
              title="Calendário anual"
              color="bg-blue-600"
              icon="📅"
            />
          )}
          {permissions.canSeeEscalas && (
            <AcessoBlock
              href="/calendario"
              title="Escalas do mês"
              color="bg-sky-400"
              icon="🗓️"
            />
          )}
          {permissions.canSeeGestaoCargos && (
            <AcessoBlock
              href="/gestao-cargos"
              title="Gestão de cargos"
              color="bg-sky-400"
              icon="🛠️"
            />
          )}
          {permissions.canSeeGaleriaMidia && (
            <AcessoBlock
              href="/midia"
              title="Galeria de mídia"
              color="bg-sky-400"
              icon="📷"
            />
          )}
        </div>
      </section>

      {}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Acessado recentemente
        </h2>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">Nenhum item recente.</p>
        </div>
      </section>
    </div>
  );
}
