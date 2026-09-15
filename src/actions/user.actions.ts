'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { v2_UserRole } from '@prisma/client';
import { t } from '@/lib/t';

export async function getUsers() {
  await requireAdmin();
  return prisma.v2_User.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      _count: {
        select: { sessions: true },
      },
    },
  });
}

export async function createUser(data: {
  username: string;
  password: string;
  fullName: string;
  role: v2_UserRole;
}): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();

  if (!data.username.trim() || !data.password || !data.fullName.trim()) {
    return { success: false, error: t('users.errors.allFieldsRequired') };
  }

  if (data.password.length < 6) {
    return { success: false, error: t('users.errors.passwordTooShort') };
  }

  // Check username uniqueness
  const existing = await prisma.v2_User.findUnique({ where: { username: data.username.trim() } });
  if (existing) {
    return { success: false, error: t('users.errors.usernameTaken') };
  }

  const passwordHash = await hashPassword(data.password);

  await prisma.v2_User.create({
    data: {
      username: data.username.trim(),
      passwordHash,
      fullName: data.fullName.trim(),
      role: data.role,
    },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(
  userId: string,
  data: { fullName?: string; role?: v2_UserRole }
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();

  const user = await prisma.v2_User.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: t('users.errors.notFound') };
  }

  // Cannot change own role
  if (data.role && userId === admin.id) {
    return { success: false, error: t('users.errors.cannotChangeOwnRole') };
  }

  await prisma.v2_User.update({
    where: { id: userId },
    data: {
      ...(data.fullName?.trim() && { fullName: data.fullName.trim() }),
      ...(data.role && { role: data.role }),
    },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleUserActive(userId: string): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { success: false, error: t('users.errors.cannotDeactivateSelf') };
  }

  const user = await prisma.v2_User.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: t('users.errors.notFound') };
  }

  await prisma.v2_User.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  // If deactivating, invalidate all their sessions
  if (user.isActive) {
    await prisma.v2_Session.deleteMany({ where: { userId } });
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: t('users.errors.passwordTooShort') };
  }

  const user = await prisma.v2_User.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: t('users.errors.notFound') };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.v2_User.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Invalidate all sessions so user must re-login
  await prisma.v2_Session.deleteMany({ where: { userId } });

  revalidatePath('/admin/users');
  return { success: true };
}
