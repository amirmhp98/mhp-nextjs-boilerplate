'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  toast,
} from '@/components/UiComponents';
import { createUserAction } from '@/actions/user.actions';
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user';
import { UserRoleSelect } from './user-role-select';

const DEFAULTS: CreateUserInput = { username: '', password: '', fullName: '', role: 'ANALYST' };

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: DEFAULTS,
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: CreateUserInput) {
    const result = await createUserAction(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('کاربر ایجاد شد');
    form.reset(DEFAULTS);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset(DEFAULTS);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          کاربر جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>کاربر جدید</DialogTitle>
          <DialogDescription>حساب کاربری جدیدی برای دسترسی به سامانه بسازید.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="نام کامل" required error={errors.fullName?.message}>
            <Input autoComplete="off" autoFocus {...form.register('fullName')} />
          </FormField>

          <FormField
            label="نام کاربری"
            required
            error={errors.username?.message}
            helperText="حروف لاتین، عدد، نقطه، خط تیره و زیرخط"
          >
            <Input dir="ltr" autoComplete="off" {...form.register('username')} />
          </FormField>

          <FormField label="رمز عبور" required error={errors.password?.message}>
            <Input
              type="password"
              dir="ltr"
              autoComplete="new-password"
              {...form.register('password')}
            />
          </FormField>

          <FormField id="create-user-role" label="نقش" required error={errors.role?.message}>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <UserRoleSelect
                  id="create-user-role"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" loading={isSubmitting}>
              ایجاد کاربر
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
