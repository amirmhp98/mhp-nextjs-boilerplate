'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/session-cookie';
import { loginSchema } from '@/lib/validations/auth';
import { authenticate, revokeSession } from '@/services/auth.service';

export type LoginState = { error?: string } | null;

/** Bound to `useActionState` in the login form. */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ورودی نامعتبر است' };
  }

  const session = await authenticate(parsed.data.username, parsed.data.password);
  if (!session) return { error: 'نام کاربری یا رمز عبور اشتباه است' };

  (await cookies()).set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
  redirect('/');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await revokeSession(token);
  cookieStore.delete(SESSION_COOKIE);
  redirect('/login');
}
