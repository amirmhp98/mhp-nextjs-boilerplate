# Critical Rules

1. **Database safety**
   - Never run `prisma db push --force-reset` or any command that drops tables with data.
   - If a migration warns about data loss, stop and review before applying.
   - Use `prisma migrate dev` in development and `prisma migrate deploy` in production.

2. **Architecture**
   - Business logic lives in `src/services/`; server actions and components stay thin.
   - App code imports UI only from `@/components/UiComponents` or `@/components/ui/*`.
