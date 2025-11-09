import { BackButton } from "@/components/BackButton";

export default function PaginaMidia() {
  return (
    <div>
      <BackButton href="/dashboard" />

      <h1 className="text-3xl font-bold">Mídia</h1>
      <p className="mt-4">
        Upload e visualização de fotos e vídeos dos cultos.
      </p>
    </div>
  );
}
