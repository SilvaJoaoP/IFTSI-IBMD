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
};

export function getPermissionsForRole(role: Role): AppPermissions {
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
        canManageMidia: false,
        canManageDocumentos: true,
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
      };

    default:
      return defaultPermissions;
  }
}
