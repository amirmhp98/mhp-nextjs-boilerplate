'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UiComponents';
import { USER_ROLES, USER_ROLE_LABELS, type UserRoleValue } from '@/lib/validations/user';

export function UserRoleSelect({
  id,
  value,
  onChange,
  disabled,
}: {
  id?: string;
  value: UserRoleValue;
  onChange: (value: UserRoleValue) => void;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as UserRoleValue)} disabled={disabled}>
      <SelectTrigger id={id} aria-label="نقش">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {USER_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {USER_ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
