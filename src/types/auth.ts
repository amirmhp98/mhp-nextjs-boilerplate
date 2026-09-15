import type { UserRole } from '@prisma/client';

export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
};
