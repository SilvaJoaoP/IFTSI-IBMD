import { BackButton } from "@/components/BackButton";
import PlanilhaDetails from "@/components/PlanilhaDetails";
import { TipoRegistro } from "@prisma/client";
import { getPlanilhaDetails, getSaldoAnterior } from "./actions";

export default async function PlanilhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const planilha = await getPlanilhaDetails(id);

  if (!planilha) {
    return (
      <div>
        <BackButton href="/planilhas" />
        <h1 className="text-2xl font-bold">Planilha não encontrada</h1>
      </div>
    );
  }

  const entradas = planilha.registros
    .filter((r) => r.tipo === TipoRegistro.ENTRADA)
    .reduce((acc, r) => acc + r.valor, 0);
  const saidas = planilha.registros
    .filter(
      (r) =>
        r.tipo === TipoRegistro.SAIDA_FIXA ||
        r.tipo === TipoRegistro.SAIDA_VARIAVEL
    )
    .reduce((acc, r) => acc + r.valor, 0);

  const saldoAnterior = await getSaldoAnterior(planilha.mes, planilha.ano);
  const saldoFinal = (saldoAnterior || 0) + entradas - saidas;

  return (
    <PlanilhaDetails
      planilha={planilha}
      entradas={entradas}
      saidas={saidas}
      saldoAnterior={saldoAnterior}
      saldoFinal={saldoFinal}
    />
  );
}
