# {{PROJECT_NAME}} — Product Reference

**Last updated:** 2026-09-15

## What it is

<!-- One paragraph: what the product does, for whom, and why it matters. -->

## Users

<!-- One line per user type. Example: **Admin** — manages users and settings. -->

- **Admin** — manages users (`/admin/users`).
- **User** — signs in and uses the product.

## Locale

One locale profile (`src/lib/locale.ts`) per deployment, chosen with `NEXT_PUBLIC_LOCALE` at build time. `fa` (default): Persian, RTL, Jalali calendar, Persian numerals, `Asia/Tehran`, toman. `en`: English, LTR, Gregorian, Latin numerals, `UTC`, USD.

## Modules & routes

<!-- Add a line per module or route as it lands. Keep it to what exists today. -->

| Route | Who | What |
|-------|-----|------|
| `/login` | everyone | Username/password sign-in (cookie session) |
| `/` | signed-in | Home |
| `/admin/users` | Admin | Create, edit, activate/deactivate users, reset passwords |
| `/components` | dev | Component gallery / visual regression surface |
| `/api/health` | ops | Liveness check |

## Data model

<!-- One line per model. Point to prisma/schema.prisma for fields. -->

- `User` — `username`, `passwordHash`, `fullName`, `role` (`ADMIN` \| `USER`), `isActive`, `lastLoginAt`
- `Session` — opaque `token` cookie, `expiresAt`, cascades on user delete

## Non-functional

<!-- Only what has actually been decided. -->

- Auth: httpOnly cookie sessions, bcrypt (12 rounds), `SKIP_AUTH=true` for DB-less UI work.
- Deployment: Docker, Next.js standalone output.
