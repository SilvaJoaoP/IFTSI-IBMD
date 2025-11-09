"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type LoginState = {
  success: boolean;
  message: string;
};

export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;

    if (!email || !senha) {
      return { success: false, message: "Email e senha são obrigatórios." };
    }

    await signIn("credentials", {
      email: email,
      senha: senha,
      redirectTo: "/dashboard",
    });

    return { success: true, message: "Login bem-sucedido!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Credenciais inválidas." };
        default:
          return { success: false, message: "Erro ao fazer login." };
      }
    }
    throw error;
  }
}
