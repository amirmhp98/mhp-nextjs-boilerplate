'use client';

import { useState, useTransition } from 'react';
import { KeyRound, MoreHorizontal, Pencil, UserCheck, UserX } from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@/components/UiComponents';
import { setUserActiveAction } from '@/actions/user.actions';
import { useAuth } from '@/components/layout/AuthProvider';
import { formatDateTime } from '@/lib/format-date';
import { USER_ROLE_LABELS } from '@/lib/validations/user';
import type { UserListItem } from '@/services/user.service';
import { EditUserDialog } from './edit-user-dialog';
import { ResetPasswordDialog } from './reset-password-dialog';

type DialogState = { kind: 'edit' | 'reset'; user: UserListItem } | null;

export function UsersTable({ users }: { users: UserListItem[] }) {
  const me = useAuth();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggleActive(user: UserListItem) {
    setPendingId(user.id);
    startTransition(async () => {
      const result = await setUserActiveAction(user.id, !user.isActive);
      setPendingId(null);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(user.isActive ? 'کاربر غیرفعال شد' : 'کاربر فعال شد');
    });
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        هنوز کاربری ثبت نشده است.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام کامل</TableHead>
              <TableHead>نام کاربری</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>آخرین ورود</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">عملیات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isMe = user.id === me.id;
              return (
                <TableRow key={user.id} data-testid={`user-row-${user.username}`}>
                  <TableCell className="font-medium">
                    {user.fullName}
                    {isMe && <span className="ms-2 text-xs text-muted-foreground">(شما)</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground" dir="ltr">
                    {user.username}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'brand' : 'secondary'}>
                      {USER_ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'outline'}>
                      {user.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`عملیات برای ${user.fullName}`}
                          loading={pendingId === user.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setDialog({ kind: 'edit', user })}>
                          <Pencil className="me-2 h-4 w-4" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDialog({ kind: 'reset', user })}>
                          <KeyRound className="me-2 h-4 w-4" />
                          بازنشانی رمز عبور
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={isMe}
                          className={user.isActive ? 'text-destructive focus:text-destructive' : ''}
                          onSelect={() => toggleActive(user)}
                        >
                          {user.isActive ? (
                            <UserX className="me-2 h-4 w-4" />
                          ) : (
                            <UserCheck className="me-2 h-4 w-4" />
                          )}
                          {user.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        user={dialog?.kind === 'edit' ? dialog.user : null}
        onClose={() => setDialog(null)}
      />
      <ResetPasswordDialog
        user={dialog?.kind === 'reset' ? dialog.user : null}
        onClose={() => setDialog(null)}
      />
    </>
  );
}
