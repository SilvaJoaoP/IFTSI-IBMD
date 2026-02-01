import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { LogoutButton } from "@/components/LogoutButton";
import { PasswordCard } from "@/components/PasswordCard";
import {
  User,
  Mail,
  Shield,
  Check,
  Calendar,
  Key,
  LogOut,
  Settings,
} from "lucide-react";

const roleDisplay: Record<Role, string> = {
  PASTOR: "Pastor Presidente",
  SECRETARIO: "Secretário(a)",
  TESOUREIRO: "Tesoureiro(a)",
  DIACONO: "Diácono / Diaconisa",
  MIDIA: "Equipe de Mídia",
  MEMBRO: "Membro",
};

const permissionLabels: Record<string, string> = {
  canSeeRelatorioFinanceiro: "Ver Relatórios Financeiros",
  canSeeRelatorioMembros: "Ver Relatórios de Membros",
  canSeeDocumentos: "Acessar Documentos",
  canSeeCalendarioAnual: "Visualizar Calendário Anual",
  canSeeEscalas: "Visualizar Escalas",
  canSeeGestaoCargos: "Gerenciar Cargos e Permissões",
  canSeeGaleriaMidia: "Acessar Galeria de Mídia",
  canManageMidia: "Gerenciar Arquivos de Mídia",
  canManageDocumentos: "Gerenciar Documentos",
  canCreateEventos: "Criar Eventos e Agendas",
  canManageEventLinks: "Gerenciar Links de Eventos",
};

const roleColors: Record<Role, string> = {
  PASTOR: "bg-purple-100 text-purple-700 border-purple-200",
  SECRETARIO: "bg-blue-100 text-blue-700 border-blue-200",
  TESOUREIRO: "bg-green-100 text-green-700 border-green-200",
  DIACONO: "bg-orange-100 text-orange-700 border-orange-200",
  MIDIA: "bg-pink-100 text-pink-700 border-pink-200",
  MEMBRO: "bg-slate-100 text-slate-700 border-slate-200",
};

export default async function PaginaPerfil() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;
  const userRole = (user.cargo as Role) || "MEMBRO";
  const permissions = getPermissionsForRole(
    userRole,
    user.status,
    user.suspendedUntil,
  );
  const userInitial = user.nome ? user.nome.charAt(0).toUpperCase() : "U";

  // Filter true permissions
  const activePermissions = Object.entries(permissions).filter(
    ([_, value]) => value === true,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BackButton href="/dashboard" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
            <p className="text-slate-500">
              Gerencie suas informações e visualize suas credenciais
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main User Card */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-3xl bg-[#0b3566] text-white flex items-center justify-center text-6xl font-bold shadow-xl shadow-blue-900/10 shrink-0">
                  {userInitial}
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left space-y-4 w-full">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider mb-2 ${
                        roleColors[userRole]
                      }`}
                    >
                      <Shield size={12} />
                      {roleDisplay[userRole]}
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {user.nome}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {user.email && (
                      <div className="flex items-center justify-center md:justify-start gap-2.5 text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Mail size={18} className="text-slate-400" />
                        <span className="font-medium text-sm">
                          {user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Management Card */}
            <PasswordCard />

            {/* Permissions List */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Settings size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Permissões de Acesso
                  </h3>
                  <p className="text-sm text-slate-500">
                    O que você pode fazer no sistema com seu cargo atual
                  </p>
                </div>
              </div>

              {activePermissions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePermissions.map(([key]) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium">
                        {permissionLabels[key] || key}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Shield size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Nenhuma permissão especial atribuída.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / More Actions */}
          <div className="space-y-6">
            {/* Account Stats / Info */}
            <div
              className={`rounded-[2rem] p-6 shadow-lg relative overflow-hidden text-white ${
                user.status === "DEACTIVATED"
                  ? "bg-red-600 shadow-red-900/10"
                  : user.status === "SUSPENDED" &&
                      user.suspendedUntil &&
                      new Date() < new Date(user.suspendedUntil)
                    ? "bg-orange-600 shadow-orange-900/10"
                    : "bg-[#0b3566] shadow-blue-900/10"
              }`}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Status da Conta</h3>
                <p className="text-white/80 text-sm mb-6">
                  {user.status === "DEACTIVATED"
                    ? "Conta Desativada"
                    : user.status === "SUSPENDED" &&
                        user.suspendedUntil &&
                        new Date() < new Date(user.suspendedUntil)
                      ? "Conta Suspensa Temporariamente"
                      : "Ativo e verificado"}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                    <Calendar size={18} className="text-white/80" />
                    <div className="text-sm">
                      <p className="text-white/60 text-xs">
                        {user.status === "ACTIVE"
                          ? "Acesso ao sistema"
                          : "Restrição"}
                      </p>
                      <p className="font-bold">
                        {user.status === "DEACTIVATED"
                          ? "Acesso Revogado"
                          : user.status === "SUSPENDED" && user.suspendedUntil
                            ? `Suspenso até ${new Date(
                                user.suspendedUntil,
                              ).toLocaleString("pt-BR")}`
                            : "Liberado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Ações</h3>

              <div className="space-y-3">
                <LogoutButton>
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all font-bold group">
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Sair da Conta
                  </button>
                </LogoutButton>

                <p className="text-xs text-center text-slate-400 pt-2">
                  Versão do Sistema 1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
