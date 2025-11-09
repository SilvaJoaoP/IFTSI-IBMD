import { BackButton } from "@/components/BackButton";
export default function PaginaPerfil() {
  return (
    <div>
      <BackButton href="/dashboard" />

      <h1 className="text-3xl font-bold">Perfil</h1>
      <p className="mt-4">Página de gerenciamento de perfil do usuário.</p>
    </div>
  );
}
