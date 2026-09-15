'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  toast,
} from '@/components/UiComponents';
import { updateUserAction } from '@/actions/user.actions';
import { useAuth } from '@/components/layout/AuthProvider';
import { updateUserSchema, type UpdateUserInput } from '@/lib/validations/user';
import type { UserListItem } from '@/services/user.service';
import { UserRoleSelect } from './user-role-select';

export function EditUserDialog({
  user,
  onClose,
}: {
  user: UserListItem | null;
  onClose: () => void;
}) {
  const me = useAuth();
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { fullName: '', role: 'ANALYST' },
  });
  const { errors, isSubmitting } = form.formState;

  // Load the selected user's values whenever a different row is opened.
  useEffect(() => {
    if (user) form.reset({ fullName: user.fullName, role: user.role });
  }, [user, form]);

  async function onSubmit(values: UpdateUserInput) {
    if (!user) return;
    const result = await updateUserAction(user.id, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('تغییرات ذخیره شد');
    onClose();
  }

  return (
    <Dialog open={user !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ویرایش کاربر</DialogTitle>
          <DialogDescription dir="ltr" className="text-start">
            {user?.username}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="نام کامل" required error={errors.fullName?.message}>
            <Input autoComplete="off" autoFocus {...form.register('fullName')} />
          </FormField>

          <FormField
            id="edit-user-role"
            label="نقش"
            required
            error={errors.role?.message}
            helperText={user?.id === me.id ? 'نقش خودتان قابل تغییر نیست' : undefined}
          >
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <UserRoleSelect
                  id="edit-user-role"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={user?.id === me.id}
                />
              )}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" loading={isSubmitting}>
              ذخیره
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
