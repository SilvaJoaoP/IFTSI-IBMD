import { auth } from "@/lib/auth";
import { StatusAlert } from "@/components/StatusAlert";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <StatusAlert
        status={session?.user?.status}
        suspendedUntil={session?.user?.suspendedUntil}
      />
      <div className="flex-1">{children}</div>
    </main>
  );
}
