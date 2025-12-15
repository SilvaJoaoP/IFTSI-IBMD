import { signOut } from "@/lib/auth";
import { LogOut } from 'lucide-react'; // Importa o ícone

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        aria-label="Sair da conta"
      >
        <LogOut className="h-6 w-6" />
      </button>
    </form>
  );
}