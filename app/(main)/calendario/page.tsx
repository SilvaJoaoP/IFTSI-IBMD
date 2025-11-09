import { BackButton } from "@/components/BackButton";

export default function PaginaCalendario() {
  return (
    <div>
      <BackButton href="/dashboard" />
      <h1 className="text-3xl font-bold">Calendário de Escalas do Mês Vigente</h1>
      <p className="mt-4">
        Visualização de escalas de serviço.
      </p>
    </div>
  );
}
