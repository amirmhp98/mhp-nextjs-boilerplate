# AGENTS.md — {{PROJECT_NAME}}

Rules for any coding agent (Claude Code, Cursor, Codex, Copilot) working in this repository.
`CLAUDE.md` adds the Claude-specific workflow on top of this file.

## What this is

An RTL-first, Persian-language web application built on Next.js 16 (App Router), React 19,
Tailwind CSS 4, Prisma 6 and PostgreSQL. Cookie sessions, no external auth provider.
`docs/PRD.md` describes the product; read it before making product decisions.

Framework docs matching the installed Next.js version are bundled at
`node_modules/next/dist/docs/`. Prefer them over training data.

## Layout of the code

```
src/
  app/            Route segments only (page/layout/route + small client islands next to them)
  actions/        Server actions: authorise → validate (zod) → call a service → revalidate
  services/       Business logic. Framework-free: no next/*, no React, no cookies
  components/
    ui/           Local primitives (Button, Card, Input, FormField, Tabs, Stepper…)
    UiComponents.tsx  Barrel for interactive widgets with RTL defaults (Dialog, Select, Table…)
    layout/       App shell: Sidebar, Header, Logo, providers
  lib/            Shared utilities: env, prisma, auth, logger, validations, formatting, navigation
  types/          Shared TypeScript types
  __tests__/      Vitest unit tests (mirrors src/ layout) + factories + prisma mock
prisma/           schema.prisma, migrations/, seed.ts
e2e/              Playwright specs and config
.claude/skills/   Vendored agent skills (see CLAUDE.md)
```

**The reference module is Users** (`src/services/user.service.ts`, `src/actions/user.actions.ts`,
`src/app/admin/users/*`, `src/lib/validations/user.ts`, tests under `src/__tests__/`).
Copy its shape for every new feature.

## Layering (enforced by ESLint)

| Layer                                       | May import                                               | Must not import                                         |
| ------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `components/**`, client islands in `app/**` | `@/components`, `@/lib` (non-server), `@/actions`, types | `@/lib/prisma`, `@/services/*`, `@prisma/client` values |
| `app/**/page.tsx`, `layout.tsx`, `route.ts` | services (reads), `@/lib/auth`, components               | `@/lib/prisma` directly                                 |
| `actions/**`                                | services, `@/lib/*`, validations                         | components, `@/lib/prisma`                              |
| `services/**`                               | `@/lib/prisma`, `@/lib/env`, other services              | `next/*`, `react`, components, actions                  |
| `lib/**`                                    | other lib modules                                        | components, actions, services                           |

Type-only imports are always allowed. `npm run lint` fails on violations.

## How a feature is built

1. **Schema**: add models to `prisma/schema.prisma` with `@@map("v2_<table>")`, run `npm run db:migrate`.
2. **Validation**: zod schemas with Persian messages in `src/lib/validations/<module>.ts`. Shared by server and client.
3. **Service**: pure functions in `src/services/<module>.service.ts`. Throw `ServiceError` for expected failures.
4. **Action**: `'use server'` file in `src/actions/<module>.actions.ts`. `requireAuth`/`requireAdmin` → `schema.safeParse(input)` → service → `revalidatePath` → return `ActionResult`.
5. **UI**: server `page.tsx` reads through the service and passes data down; client islands call actions and show `toast` on the result. Forms use `react-hook-form` + `zodResolver` + `FormField`.
6. **Tests**: service tests with `prismaMock` + factories; action tests mock the service; an e2e spec for the happy path.
7. **Nav**: add the route to `src/lib/navigation.ts` (single source for sidebar and header title).

## Non-negotiable rules

### Database safety

- **Never** run `prisma db push --force-reset`, `prisma migrate reset`, or anything that drops tables.
- Run `prisma db pull` before editing the schema when pointed at a shared database, so tables Prisma does not know about are not dropped.
- New tables and enums use the `v2_` prefix **in the database name only** (`@@map`). Model names stay clean.
- If a migration warns about data loss, stop and ask.

### Security

- Passwords: bcrypt, 12 rounds (`hashPassword` in `auth.service.ts`). Session cookies carry a random token; the DB stores its SHA-256.
- Every server action authorises first (`requireAuth`/`requireAdmin`) and validates with zod before touching a service. Inputs are typed `unknown`.
- Pages guard their own data access (layouts and pages render in parallel).
- Server-only modules import `'server-only'`. Environment is read through `src/lib/env.ts`, never `process.env` in app code.
- Error messages shown to users come from `ServiceError` or zod; unexpected errors are logged and replaced with a generic message.

### RTL and Persian

- `<html lang="fa" dir="rtl">` is set once in the root layout. Do not override direction in pages.
- Only logical Tailwind utilities: `ms- me- ps- pe- start- end- border-s border-e text-start text-end`. `npm run lint:rtl` rejects `ml/mr/pl/pr/left/right`.
- Mixed Persian/Latin text: wrap in `.bidi-plaintext` or set `dir="ltr"` on the Latin-only element (usernames, codes).
- Numbers and dates through `src/lib/format-number.ts` and `src/lib/format-date.ts` (Persian digits, Jalali calendar, Asia/Tehran).
- User-facing strings are Persian and live in the component that renders them.

### UI

- Import primitives from `@/components/ui/*` and widgets from `@/components/UiComponents`. Direct imports from the underlying UI package are blocked by lint.
- Theme colors come from CSS variables in `src/app/globals.css`; no hex colors in components.
- Icon-only buttons need `aria-label`. Form fields go through `FormField` so labels and errors are wired.

### Code style

- TypeScript strict. `npm run lint:all` = ESLint + RTL check + `tsc` + Prettier; it must pass before you report done.
- camelCase functions/variables, PascalCase components/types, kebab-case files.
- `@/*` alias for imports; no `../../` chains.
- Keep files small and named after what they export. No barrel files except `components/ui/index.ts` and `UiComponents.tsx`.

## Commands

| Command                            | What it does                                                  |
| ---------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                      | Dev server on :3000                                           |
| `npm run db:up`                    | Start Postgres via docker compose                             |
| `npm run db:migrate` / `db:deploy` | Create a migration (dev) / apply migrations (CI, prod)        |
| `npm run db:seed`                  | Create the first admin (`admin` / `admin123`)                 |
| `npm run lint:all`                 | ESLint, RTL check, typecheck, Prettier                        |
| `npm run test` / `test:coverage`   | Vitest unit tests                                             |
| `npm run test:e2e`                 | Playwright (needs a running Postgres)                         |
| `npm run build`                    | Production build (needs a syntactically valid `DATABASE_URL`) |

## Definition of done

Build passes, `lint:all` passes, unit tests pass, the feature was exercised in the browser
(or an e2e spec covers it), and `docs/PRD.md` reflects any product-visible change.
