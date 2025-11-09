import { BackButton } from "@/components/BackButton";

export default function PaginaInicial() {
  return (
    <div>
      <BackButton href="/dashboard" />
      
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg">Bem-vindo ao Sistema de Gestão da IBMD.</p>
      <p className="mt-4">
        Selecione uma das opções na barra lateral para começar a trabalhar.
      </p>
    </div>
  );
}
