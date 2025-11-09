'use server';

import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';


export async function createUserAction(formData: FormData) {
  
  const session = await auth();
  if (session?.user?.cargo !== Role.PASTOR) {
    throw new Error('Não autorizado');
  }

  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const cpf = formData.get('cpf') as string | null;
  const cargo = formData.get('cargo') as Role;
  const senha = formData.get('senha') as string;

  if (!nome || !email || !cargo || !senha) {
    throw new Error('Campos obrigatórios estão faltando.');
  }

  const hashedPassword = await hash(senha, 10);

  try {
    await prisma.user.create({
      data: {
        nome,
        email,
        cpf: cpf || null,
        cargo,
        senha: hashedPassword,
      },
    });
  } catch (error) {
    return { success: false, message: 'Email ou CPF já cadastrado.' };
  }

  revalidatePath('/gestao-cargos');
  return { success: true, message: 'Usuário criado com sucesso.' };
}

export async function deleteUserAction(id: string) {
  const session = await auth();
  if (session?.user?.cargo !== Role.PASTOR) {
    throw new Error('Não autorizado');
  }

  if (session.user.id === id) {
    throw new Error('Não é possível deletar a si mesmo.');
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    return { success: false, message: 'Erro ao deletar usuário.' };
  }

  return { success: true, message: 'Usuário deletado.' };
}

export async function updateUserAction(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.cargo !== Role.PASTOR) {
    throw new Error('Não autorizado');
  }

  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const cpf = formData.get('cpf') as string | null;
  const cargo = formData.get('cargo') as Role;
  const novaSenha = formData.get('senha') as string | null;

  if (!id || !nome || !email || !cargo) {
    throw new Error('Campos obrigatórios estão faltando.');
  }

  let hashedPassword: string | undefined = undefined;
  if (novaSenha && novaSenha.trim() !== '') {
    hashedPassword = await hash(novaSenha, 10);
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        nome,
        email,
        cpf: cpf || null,
        cargo,
        senha: hashedPassword, 
      },
    });
  } catch (error) {
    return { success: false, message: 'Email ou CPF já cadastrado em outra conta.' };
  }

  revalidatePath('/gestao-cargos');
  redirect('/gestao-cargos');
}