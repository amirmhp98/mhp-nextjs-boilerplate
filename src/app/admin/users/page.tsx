import { t } from '@/lib/t';

export default function AdminUsersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('users.title')}</h1>
      <p className="text-muted-foreground text-sm">
        {t('users.placeholder')}
      </p>
    </div>
  );
}
