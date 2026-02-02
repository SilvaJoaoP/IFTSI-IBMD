import { getMembros } from "./actions";
import MembrosClient from "./MembrosClient";
import { BackButton } from "@/components/BackButton";

export default async function MembrosPage() {
  const { data: membros } = await getMembros();

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8">
        <BackButton href="/dashboard" />
      </div>
      <MembrosClient initialMembros={membros || []} />
    </div>
  );
}
