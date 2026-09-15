'use server';

import { login, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { t } from '@/lib/t';

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const username = (formData.get('username') as string)?.trim();
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: t('auth.errors.missingCredentials') };
  }

  const result = await login(username, password);
  if (!result.success) {
    return { error: result.error };
  }

  redirect('/');
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/login');
}
