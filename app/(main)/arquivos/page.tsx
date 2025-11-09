import { BackButton } from "@/components/BackButton";

export default function PaginaArquivos() {
  return (
    <div>
      <BackButton href="/dashboard" />
      <h1 className="text-3xl font-bold">Arquivos</h1>
      <p className="mt-4">Repositório geral de documentos e arquivos da igreja.</p>
    </div>
  );
}