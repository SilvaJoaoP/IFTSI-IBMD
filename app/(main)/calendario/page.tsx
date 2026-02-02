import { BackButton } from "@/components/BackButton";
import { CalendarClient } from "./CalendarClient";
import { getEventsAction } from "./actions";
import { Calendar as CalendarIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getPermissionsForRole } from "@/lib/permissions";
import { Role } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaginaCalendario(props: PageProps) {
  const session = await auth();
  const userRole = (session?.user?.cargo as Role) || Role.MEMBRO;
  const permissions = getPermissionsForRole(
    userRole,
    session?.user?.status,
    session?.user?.suspendedUntil
      ? new Date(session.user.suspendedUntil)
      : undefined,
  );

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

  const events = await getEventsAction(startOfMonth, endOfMonth);

  return (
    <div className="pb-20 max-w-[1600px] mx-auto p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <BackButton href="/dashboard" />
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 bg-[#0b3566]/10 text-[#0b3566] rounded-2xl flex items-center justify-center">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Calendário de Eventos
              </h1>
              <p className="text-slate-500 font-medium">
                Planejamento e escalas do mês
              </p>
            </div>
          </div>
        </div>
      </div>

      <CalendarClient
        events={events}
        currentDate={currentDate}
        canCreate={permissions.canCreateEventos}
        canManageLinks={permissions.canManageEventLinks}
      />
    </div>
  );
}
