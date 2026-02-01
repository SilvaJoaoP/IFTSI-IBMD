import { auth } from "@/lib/auth";
import { getEscalasAction, getUsersSimpleAction } from "./actions";
import { EscalaCalendarClient } from "./EscalaCalendarClient";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { CalendarDays } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaginaEscalas(props: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const monthParam =
    typeof searchParams?.month === "string" ? searchParams.month : undefined;

  let currentDate = new Date();
  if (monthParam) {
    const [y, m] = monthParam.split("-");
    const parsedDate = new Date(parseInt(y), parseInt(m) - 1, 1);
    if (!isNaN(parsedDate.getTime())) {
      currentDate = parsedDate;
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const escalas = await getEscalasAction(startOfMonth, endOfMonth);
  const users = await getUsersSimpleAction();

  const isPastor = session.user.cargo === "PASTOR";

  return (
    <div className="container mx-auto p-4 max-w-6xl pb-24">
      <div className="mb-8">
        <BackButton href="/dashboard" />
        <div className="flex items-center gap-3 mt-4">
          <div className="w-12 h-12 bg-[#0b3566]/10 text-[#0b3566] rounded-2xl flex items-center justify-center">
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0b3566]">
              Escalas e Funções
            </h1>
            <p className="text-slate-500 font-medium">
              Gestão de escalas dos ministérios
            </p>
          </div>
        </div>
      </div>

      <EscalaCalendarClient
        escalas={escalas}
        currentDate={currentDate}
        users={users}
        isPastor={isPastor}
      />
    </div>
  );
}
