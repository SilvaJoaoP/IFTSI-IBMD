import { signOut } from "@/lib/auth";

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
        className="text-sm text-gray-600 hover:text-blue-600 underline"
      >
        Sair
      </button>
    </form>
  );
}
