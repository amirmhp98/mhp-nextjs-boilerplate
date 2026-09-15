import { z } from 'zod';

/**
 * Shared by server actions (runtime validation) and client forms (zodResolver).
 * Deliberately free of Prisma imports so it can ship to the browser.
 */

export const USER_ROLES = ['ADMIN', 'ANALYST'] as const;
export type UserRoleValue = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRoleValue, string> = {
  ADMIN: 'مدیر',
  ANALYST: 'تحلیلگر',
};

const username = z
  .string()
  .trim()
  .min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد')
  .max(32, 'نام کاربری حداکثر ۳۲ کاراکتر است')
  .regex(/^[a-z0-9._-]+$/i, 'فقط حروف لاتین، عدد، نقطه، خط تیره و زیرخط مجاز است');

const password = z
  .string()
  .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
  .max(128, 'رمز عبور حداکثر ۱۲۸ کاراکتر است');

const fullName = z
  .string()
  .trim()
  .min(2, 'نام کامل الزامی است')
  .max(80, 'نام کامل حداکثر ۸۰ کاراکتر است');

const role = z.enum(USER_ROLES, { message: 'نقش نامعتبر است' });

export const userIdSchema = z.string().min(1, 'شناسه کاربر نامعتبر است');

export const createUserSchema = z.object({ username, password, fullName, role });
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({ fullName, role });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const resetPasswordSchema = z.object({ password });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
