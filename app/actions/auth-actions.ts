'use server'

import { prisma } from '@/lib/prisma';
import { createSession, deleteSession, hashPassword, verifyPassword } from '@/lib/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  name: z.string().trim().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }).optional(),
});

export async function registerUser(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const result = authSchema.safeParse({ email, password, name });
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (existingUser) {
      return {
        error: 'Este e-mail já está cadastrado.',
      };
    }

    const hashedPassword = await hashPassword(result.data.password);
    const user = await prisma.user.create({
      data: {
        email: result.data.email,
        password: hashedPassword,
        name: result.data.name || null,
      },
    });

    await createSession(user.id, user.email, user.name);

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro no registro:', error);
    return {
      error: 'Ocorreu um erro ao criar a conta. Tente novamente.',
    };
  }

  redirect('/');
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = authSchema.omit({ name: true }).safeParse({ email, password });
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user) {
      return {
        error: 'E-mail ou senha incorretos.',
      };
    }

    const isPasswordValid = await verifyPassword(result.data.password, user.password);
    if (!isPasswordValid) {
      return {
        error: 'E-mail ou senha incorretos.',
      };
    }

    await createSession(user.id, user.email, user.name);

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro no login:', error);
    return {
      error: 'Ocorreu um erro ao fazer login. Tente novamente.',
    };
  }

  redirect('/');
}

export async function logoutUser() {
  await deleteSession();
  revalidatePath('/');
  redirect('/login');
}
