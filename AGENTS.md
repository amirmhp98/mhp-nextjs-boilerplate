# AGENTS.md — {{PROJECT_NAME}}

Rules for any coding agent (Claude Code, Cursor, Codex, Copilot) working in this repository.
`CLAUDE.md` adds the Claude-specific workflow and tooling on top of this file.

## What this is

A locale-profile-driven web application built on Next.js 16 (App Router), React 19, Tailwind CSS 4,
Prisma 6 and PostgreSQL. One language per project, chosen at setup: Persian / RTL / Jalali or
English / LTR / Gregorian.
Cookie sessions, no external auth provider. `docs/PRD.md` describes the product; read it before
making product decisions. `docs/decisions/` records why the big choices were made.

Framework docs matching the installed Next.js version are bundled at
`node_modules/next/dist/docs/`. Prefer them over training data.

## Layout of the code

```
src/
  app/
    layout.tsx        Document shell only: html/body, font, theme, DirectionProvider, Toaster
    (auth)/login/     Bare pages (no app chrome)
    (app)/            Authenticated area: layout.tsx runs requireAuth() and renders the shell
      admin/          Admin-only (admin/layout.tsx runs requireAdmin())
    api/health/       Readiness probe, excluded from auth
  actions/            Server actions: authorise → validate (zod) → call a service → revalidate
  services/           Business logic. Framework-free: no next/*, no React, no cookies
  components/
    ui/               Locally owned shadcn components (RTL mode); the only place UI primitives are imported
    UiComponents.tsx  Barrel: the single UI import surface for app code
    layout/           App shell: Sidebar, Header, Logo, providers
  lib/
    locale.ts         Locale profile (lang, dir, calendar, numerals, tz, currency) — source of truth
    t.ts              t() / tp() message lookup; strings live in src/messages/
    format.ts         Intl formatting: numbers, currency, dates, relative time, lists, plural, sort
    persian.ts        Input normalisation (digits, Arabic/Persian characters)
    validators/       Iranian identifiers (national ID, mobile, SHEBA, card, postal code)
    validations/      zod schemas per module, shared by server and client
    env.ts            Validated environment (server-only)
    auth.ts           getSession / requireAuth / requireAdmin (server-only)
    action-result.ts  ActionResult<T>, ok(), fail(), fromZodError(), fromError()
    errors.ts         ServiceError
    navigation.ts     Single nav config for sidebar and header title
    prisma.ts, logger.ts, session-cookie.ts, preferences.ts, app-config.ts, theme.ts, utils.ts
  messages/           User-facing strings: index.ts exports the project's one dictionary
  types/              Shared TypeScript types
  __tests__/          Vitest unit tests (mirrors src/) + factories + prisma mock
prisma/               schema.prisma, migrations/, seed.ts; prisma.config.ts at the root
e2e/                  Playwright config and specs (locators read copy through t())
scripts/              new-module.mjs scaffold, rtl-smoke-check.mjs
.claude/              Claude Code settings and vendored skills (committed on purpose)
```

**The reference module is Users**: `lib/validations/user.ts` → `services/user.service.ts` →
`actions/user.actions.ts` → `app/(app)/admin/users/*` → tests under `src/__tests__/` and `e2e/`.
`npm run new:module <name>` scaffolds a new module in the same shape.

## Layering (enforced by ESLint)

| Layer                                       | May import                                               | Must not import                                                                |
| ------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `components/**`, client islands in `app/**` | `@/components`, `@/lib` (non-server), `@/actions`, types | `@/lib/prisma`, `@/services/*`, `@prisma/client` values, UI primitive packages |
| `app/**/page.tsx`, `layout.tsx`, `route.ts` | services (reads), `@/lib/auth`, components               | `@/lib/prisma` directly                                                        |
| `actions/**`                                | services, `@/lib/*`, validations                         | components, `@/lib/prisma`                                                     |
| `services/**`                               | `@/lib/prisma`, `@/lib/env`, `@/lib/t`, other services   | `next/*`, `react`, components, actions                                         |
| `lib/**`                                    | other lib modules                                        | components, actions, services                                                  |
| `components/ui/**`                          | `@radix-ui/*`, `sonner`, `react-day-picker`, `input-otp` | — (the only place these may be imported)                                       |

Type-only imports are always allowed. `npm run lint` fails on violations.

## How a feature is built

1. **Scaffold**: `npm run new:module <name>` creates validation, service, action, page, client island and test stubs.
2. **Schema**: add the model to `prisma/schema.prisma`, run `npm run db:migrate -- --name <change>`. Commit the migration.
3. **Strings**: add keys to the dictionary in `src/messages/`. Components call `t('key')`; never inline text.
4. **Validation**: zod schemas in `src/lib/validations/<module>.ts` with `t()` messages. Shared by server and client.
5. **Service**: pure functions. Throw `ServiceError(t('...'), 'CODE')` for expected failures.
6. **Action**: `'use server'` file. `requireAuth`/`requireAdmin` → `schema.safeParse(input)` → service → `revalidatePath` → `ActionResult`. Inputs are typed `unknown`.
7. **UI**: server `page.tsx` calls `requireAuth()` itself, reads through the service, passes data down; client islands call actions and show `toast` on the result. Forms: `react-hook-form` + `zodResolver` + `FormField`.
8. **Tests**: service tests with `prismaMock` + factories; action tests mock the service; an e2e spec for the happy path using `t()` for locators.
9. **Nav**: add the route to `src/lib/navigation.ts`.

## Non-negotiable rules

### Database

- Never run `prisma db push --force-reset` or `prisma migrate reset`. If a migration warns about data loss, stop and ask.
- Every schema change ships with a migration under `prisma/migrations/`.
- Index foreign keys and common filters (`@@index`).

### Security

- Passwords: bcrypt, 12 rounds. Session cookies carry a random token; the database stores its SHA-256.
- Login is throttled per username (5 failures / 15 minutes) in `auth.service.ts`; swap the in-memory store for Redis when running several replicas.
- Every server action authorises first and validates with zod before touching a service.
- Pages guard their own data access (layouts and pages render in parallel).
- Server-only modules import `'server-only'`. Environment is read through `src/lib/env.ts`, never `process.env` in app code (the proxy is the one exception).
- User-facing error messages come from `ServiceError` or zod; unexpected errors are logged and replaced by `t('errors.unexpected')`.

### Locale and direction

- `src/lib/locale.ts` decides language, direction, calendar, numerals, time zone and currency (set once by `setup.sh --locale`). Never hardcode `'rtl'`, `'fa-IR'`, Persian digits or a calendar; read the profile.
- Logical Tailwind utilities only: `ms- me- ps- pe- start- end- border-s border-e rounded-s rounded-e text-start text-end`. `npm run lint:rtl` rejects physical ones.
- Overlays take logical sides: `side="start" | "end"` on Tooltip, Popover, DropdownMenu, Sheet content.
- Directional icons flip: chevrons and arrows get `rtl:rotate-180`; panel icons get `rtl:-scale-x-100`.
- Strings go through `t()` / `tp()`. Numbers, dates and currency through `@/lib/format`. Free-text input is normalised with `@/lib/persian` and gets `dir="auto"`. Inline Latin runs (usernames, codes, phones) are wrapped in `<Ltr>`.

### UI

- Import from `@/components/UiComponents` or `@/components/ui/*`. Primitive packages are blocked elsewhere by lint.
- Theme colours come from CSS variables in `src/app/globals.css`; no hex colours in components.
- Icon-only buttons need `aria-label`. Form fields go through `FormField` so labels and errors are wired.

### Code style

- TypeScript strict. `npm run lint:all` = ESLint + RTL check + `tsc` + Prettier; it must pass before you report done.
- camelCase functions/variables, PascalCase components/types, kebab-case files. `@/*` alias; no `../../` chains.
- Keep files small and named after what they export.

## Commands

| Command                                                  | What it does                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run dev`                                            | Dev server on :3000                                                                        |
| `npm run db:up` / `db:migrate` / `db:deploy` / `db:seed` | Postgres via docker compose / create a migration / apply migrations / seed the first admin |
| `npm run new:module <name>`                              | Scaffold a module in the reference shape                                                   |
| `npm run lint:all`                                       | ESLint, RTL check, typecheck, Prettier                                                     |
| `npm run test` / `test:coverage`                         | Vitest unit tests                                                                          |
| `npm run test:e2e`                                       | Playwright (needs Postgres; `PORT=3001` to run beside another dev server)                  |
| `npm run build`                                          | Production build (needs a syntactically valid `DATABASE_URL`)                              |
| `npm run deps:update`                                    | Bump dependencies to latest minor/patch (Renovate does this weekly in CI)                  |

## Definition of done

Build passes, `lint:all` passes, unit tests pass, the feature was exercised in the browser
(or an e2e spec covers it), every new string has a dictionary key, and `docs/PRD.md` reflects any
product-visible change.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
