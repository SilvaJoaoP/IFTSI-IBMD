import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { Search, LogOut } from 'lucide-react';

const PRIMARY_BLUE = "bg-[#0b3566]";
const HOVER_BLUE = "hover:bg-[#072646]";

function ProfileIcon({ nome }: { nome: string }) {
  const initial = nome ? nome.charAt(0).toUpperCase() : 'U';
  return (
    <Link
      href="/perfil"
      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md transition-shadow hover:shadow-lg"
      aria-label={`Ver perfil de ${nome}`}
    >
      {initial}
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
      className={`p-5 rounded-xl text-white font-semibold flex flex-col justify-between h-36 transform transition-all duration-300 ${color} shadow-lg hover:shadow-xl hover:scale-[1.02]`}
    >
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="text-lg leading-tight">{title}</h3>
    </Link>
  );
}

function LogoutSubmitButton() {
  return (
    <button 
      type="submit" 
      className="p-2 rounded-full text-gray-500 hover:text-[#0b3566] hover:bg-gray-100 transition-colors duration-200"
      aria-label="Sair da conta"
    >
      <LogOut className="h-6 w-6" />
    </button>
  );
}

function StyledLogoutButton() {
  return (
    <LogoutButton>
      <LogoutSubmitButton />
    </LogoutButton>
  );
}

export default async function PaginaDashboard() {
  const session = await auth();

  if (!session?.user?.cargo) {
    redirect("/");
  }

  const userRole = session.user.cargo as Role;
  const userName = session.user.nome || "Usuário";
  const permissions = getPermissionsForRole(userRole);

  return (
    <div className="min-h-screen bg-gray-50"> 
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 mb-10 border-b border-gray-200">
          
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-extrabold text-[#0b3566]">Igreja Monte de Deus</h1>
            <p className="text-lg text-gray-600 mt-1">
              Bem-vindo de volta, <span className="font-semibold">{userName}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Pesquisa Rápida"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            <ProfileIcon nome={userName} />
            <StyledLogoutButton />
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
            Suas permissões de acesso
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {permissions.canSeeRelatorioFinanceiro && (
              <AcessoBlock
                href="/planilhas"
                title="Relatório financeiro"
                color={PRIMARY_BLUE + ' ' + HOVER_BLUE}
                icon="📊"
              />
            )}
            
            {permissions.canSeeRelatorioMembros && (
              <AcessoBlock
                href="/membros"
                title="Relatório de membros"
                color={PRIMARY_BLUE + ' ' + HOVER_BLUE}
                icon="👥"
              />
            )}
            
            {permissions.canSeeDocumentos && (
              <AcessoBlock
                href="/arquivos"
                title="Documentos"
                color={PRIMARY_BLUE + ' ' + HOVER_BLUE}
                icon="📁"
              />
            )}
            
            {permissions.canSeeCalendarioAnual && (
              <AcessoBlock
                href="/calendario"
                title="Calendário anual"
                color="bg-sky-500 hover:bg-sky-600"
                icon="📅"
              />
            )}
            
            {permissions.canSeeEscalas && (
              <AcessoBlock
                href="/calendario"
                title="Escalas do mês"
                color="bg-sky-500 hover:bg-sky-600"
                icon="🗓️"
              />
            )}
            
            {permissions.canSeeGestaoCargos && (
              <AcessoBlock
                href="/gestao-cargos"
                title="Gestão de cargos"
                color="bg-sky-500 hover:bg-sky-600"
                icon="🛠️"
              />
            )}
            
            {permissions.canSeeGaleriaMidia && (
              <AcessoBlock
                href="/midia"
                title="Galeria de mídia"
                color="bg-sky-500 hover:bg-sky-600"
                icon="📷"
              />
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-l-4 border-blue-500 pl-3">
            Acessado recentemente
          </h2>
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <p className="text-gray-500">Nenhum item recente.</p>
          </div>
        </section>
      </div>
    </div>
  );
}