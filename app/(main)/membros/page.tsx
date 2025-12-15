import { getMembros } from "./actions";
import MembrosClient from "./MembrosClient";
import { BackButton } from "@/components/BackButton";

export default async function MembrosPage() {
  const { data: membros } = await getMembros();

  return (
    <div className="p-6">
      <div className="mb-4">
        <BackButton href="/dashboard" />
      </div>
      <MembrosClient initialMembros={membros || []} />
    </div>
  );
}
