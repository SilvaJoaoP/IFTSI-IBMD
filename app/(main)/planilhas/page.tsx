import { BackButton } from "@/components/BackButton";

export default function PaginaPlanilhas() {
  return (
    <div>
      <BackButton href="/dashboard" />

      <h1 className="text-3xl font-bold">Planilhas</h1>
      <p className="mt-4">
        Gestão de planilhas financeiras (Dízimos, Ofertas, etc.)
      </p>

      {}
    </div>
  );
}
