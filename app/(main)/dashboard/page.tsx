import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { 
  Search, 
  LogOut, 
  PieChart, 
  Users, 
  FileText, 
  Calendar, 
  CalendarDays,
  Settings, 
  Image as ImageIcon, 
  ChevronRight,
  Bell
} from 'lucide-react';

function DashboardCard({
  href,
  title,
  description,
  icon: Icon,
  colorClass = "text-blue-600 bg-blue-50",
}: {
  href: string;
  title: string;
  description?: string;
  icon: any;
  colorClass?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${colorClass}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">
        {title}
      </h3>
      {description && <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{description}</p>}
      
      <div className="mt-auto flex items-center text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
        Acessar <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ProfileButton({ nome }: { nome: string }) {
  const initial = nome ? nome.charAt(0).toUpperCase() : 'U';
  return (
    <Link
      href="/perfil"
      className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all shadow-sm group"
    >
      <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
        {initial}
      </div>
      <div className="hidden sm:flex flex-col items-start">
        <span className="text-xs text-gray-500 font-medium">Conta</span>
        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-800 leading-none">{nome.split(' ')[0]}</span>
      </div>
    </Link>
  );
}

function LogoutSubmitButton() {
  return (
    <button 
      type="submit" 
      className="p-3 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-100"
      aria-label="Sair da conta"
    >
      <LogOut className="h-5 w-5" />
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
        
        <header className="flex flex-col md:flex-row justify-between items-center py-4 mb-12 gap-6 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b3566] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">
              I
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">IMBD Gestão</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full w-64 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
            </button>
            <ProfileButton nome={userName} />
            <StyledLogoutButton />
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-14">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
             {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                Painel Administrativo
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b3566] mb-4 leading-tight">
                Olá, {userName.split(' ')[0]}.
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                Bem-vindo ao sistema de gestão da Igreja Batista Monte de Deus. Gerencie membros, escalas e documentos com facilidade.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Menu de Acesso
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {permissions.canSeeRelatorioFinanceiro && (
              <DashboardCard
                href="/planilhas"
                title="Financeiro"
                description="Relatórios de dízimos, ofertas e saídas."
                icon={PieChart}
                colorClass="bg-emerald-50 text-emerald-600"
              />
            )}
            
            {permissions.canSeeRelatorioMembros && (
              <DashboardCard
                href="/membros"
                title="Membros"
                description="Gestão de cadastro e relatório de membros."
                icon={Users}
                colorClass="bg-blue-50 text-blue-600"
              />
            )}
            
            {permissions.canSeeDocumentos && (
              <DashboardCard
                href="/arquivos"
                title="Documentos"
                description="Arquivo digital e atas de reunião."
                icon={FileText}
                colorClass="bg-amber-50 text-amber-600"
              />
            )}
            
            {permissions.canSeeCalendarioAnual && (
              <DashboardCard
                href="/calendario"
                title="Calendário"
                description="Eventos anuais e programação."
                icon={Calendar}
                colorClass="bg-purple-50 text-purple-600"
              />
            )}
            
            {permissions.canSeeEscalas && (
              <DashboardCard
                href="/calendario"
                title="Escalas"
                description="Organização de escalas dos ministérios."
                icon={CalendarDays}
                colorClass="bg-rose-50 text-rose-600"
              />
            )}
            
            {permissions.canSeeGestaoCargos && (
              <DashboardCard
                href="/gestao-cargos"
                title="Administração"
                description="Gestão de usuários e permissões."
                icon={Settings}
                colorClass="bg-slate-100 text-slate-700"
              />
            )}
            
            {permissions.canSeeGaleriaMidia && (
              <DashboardCard
                href="/midia"
                title="Mídia"
                description="Galeria de fotos e recursos visuais."
                icon={ImageIcon}
                colorClass="bg-indigo-50 text-indigo-600"
              />
            )}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Atividades Recentes</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ver tudo</button>
          </div>
          <div className="p-12 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Tudo limpo por aqui</h3>
            <p className="text-gray-500">Nenhuma atividade recente registrada no sistema.</p>
          </div>
        </section>
      </div>
    </div>
  );
}