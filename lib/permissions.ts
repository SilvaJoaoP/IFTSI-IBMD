import { Role } from "@prisma/client";

interface AppPermissions {
  canSeeRelatorioFinanceiro: boolean;
  canSeeRelatorioMembros: boolean;
  canSeeDocumentos: boolean;
  canSeeCalendarioAnual: boolean;
  canSeeEscalas: boolean;
  canSeeGestaoCargos: boolean;
  canSeeGaleriaMidia: boolean;

  canManageMidia: boolean;
  canManageDocumentos: boolean;

  // Permissões do Calendário
  canCreateEventos: boolean;
  canManageEventLinks: boolean; // Permissão específica para mídias
}

const defaultPermissions: AppPermissions = {
  canSeeRelatorioFinanceiro: false,
  canSeeRelatorioMembros: false,
  canSeeDocumentos: false,
  canSeeCalendarioAnual: false,
  canSeeEscalas: false,
  canSeeGestaoCargos: false,
  canSeeGaleriaMidia: false,

  canManageMidia: false,
  canManageDocumentos: false,

  canCreateEventos: false,
  canManageEventLinks: false,
};

export function getPermissionsForRole(
  role: Role,
  status: string = "ACTIVE",
  suspendedUntil?: Date | null,
): AppPermissions {
  // Se estiver desativado, remove todas as permissões
  if (status === "DEACTIVATED") {
    return defaultPermissions;
  }

  // Se estiver suspenso e o prazo não expirou, remove todas as permissões
  if (
    status === "SUSPENDED" &&
    suspendedUntil &&
    new Date() < new Date(suspendedUntil)
  ) {
    return defaultPermissions;
  }

  // Se for "SUSPENDED" mas o prazo já passou, consideramos ativo (soft activation)
  // ou se não tiver prazo definido na suspensão (segurança).
  if (
    status === "SUSPENDED" &&
    (!suspendedUntil || new Date() >= new Date(suspendedUntil))
  ) {
    // Retorna permissões normais
  }

  switch (role) {
    case Role.PASTOR:
      return {
        canSeeRelatorioFinanceiro: true,
        canSeeRelatorioMembros: true,
        canSeeDocumentos: true,
        canSeeCalendarioAnual: true,
        canSeeEscalas: true,
        canSeeGestaoCargos: true,
        canSeeGaleriaMidia: true,

        canManageMidia: true,
        canManageDocumentos: true,

        canCreateEventos: true,
        canManageEventLinks: true,
      };

    case Role.TESOUREIRO:
      return {
        ...defaultPermissions,
        canSeeRelatorioFinanceiro: true,
        canSeeDocumentos: true,
        canSeeGaleriaMidia: true,
        canManageMidia: false,
        canManageDocumentos: false,
      };

    case Role.SECRETARIO:
      return {
        ...defaultPermissions,
        canSeeRelatorioMembros: true,
        canSeeDocumentos: true,
        canSeeGaleriaMidia: true,
        canSeeCalendarioAnual: true, // Adicionado acesso a ver

        canManageMidia: false,
        canManageDocumentos: true,

        canCreateEventos: true,
        canManageEventLinks: true,
      };

    case Role.DIACONO:
      return {
        ...defaultPermissions,
        canSeeCalendarioAnual: true,
        canSeeEscalas: true,
        canSeeGaleriaMidia: true,
        canManageMidia: false,
      };

    case Role.MIDIA:
      return {
        ...defaultPermissions,
        canSeeEscalas: true,
        canSeeGaleriaMidia: true,
        canManageMidia: true,
        canSeeCalendarioAnual: true,

        // Mídia pode apenas gerenciar links nos eventos
        canCreateEventos: false,
        canManageEventLinks: true,
      };

    default:
      return defaultPermissions;
  }
}
