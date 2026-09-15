import { describe, expect, it } from 'vitest';
import { loginSchema } from '@/lib/validations/auth';
import { createUserSchema, resetPasswordSchema, updateUserSchema } from '@/lib/validations/user';

describe('loginSchema', () => {
  it('trims the username and requires both fields', () => {
    expect(loginSchema.parse({ username: '  admin ', password: 'x' })).toEqual({
      username: 'admin',
      password: 'x',
    });
    expect(loginSchema.safeParse({ username: '', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ username: 'a', password: '' }).success).toBe(false);
  });
});

describe('createUserSchema', () => {
  const valid = {
    username: 'new.user',
    password: 'longenough',
    fullName: 'کاربر',
    role: 'ANALYST',
  };

  it('accepts a valid payload', () => {
    expect(createUserSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['short username', { ...valid, username: 'ab' }],
    ['persian username', { ...valid, username: 'کاربر' }],
    ['short password', { ...valid, password: '1234567' }],
    ['empty name', { ...valid, fullName: ' ' }],
    ['unknown role', { ...valid, role: 'SUPERUSER' }],
    ['missing role', { ...valid, role: undefined }],
  ])('rejects %s', (_label, payload) => {
    const result = createUserSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toMatch(/[؀-ۿ]/);
  });
});

describe('updateUserSchema / resetPasswordSchema', () => {
  it('updateUserSchema requires name and role only', () => {
    expect(updateUserSchema.safeParse({ fullName: 'نام', role: 'ADMIN' }).success).toBe(true);
    expect(updateUserSchema.safeParse({ fullName: 'نام' }).success).toBe(false);
  });

  it('resetPasswordSchema enforces the minimum length', () => {
    expect(resetPasswordSchema.safeParse({ password: 'short' }).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ password: 'long enough' }).success).toBe(true);
  });
});
