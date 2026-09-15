# {{PROJECT_NAME}}

Locale-profile-driven web application boilerplate: Next.js 16 · React 19 · Tailwind CSS 4 · Prisma 6 · PostgreSQL.
One language per project, chosen at setup: Persian / RTL / Jalali (default) or English / LTR / Gregorian.
Built to be driven by AI coding agents: the architecture is enforced by lint, one complete reference
module shows the pattern, a scaffold copies it, and the agent configuration ships with the repo.

## Quick start

Requirements: Node LTS (`.nvmrc`), Docker (for the local database) or any PostgreSQL 14+.

```bash
./setup.sh my-project     # add --locale en for an English project (default: fa)
npm run db:up             # Postgres in Docker (or edit DATABASE_URL in .env)
npm run db:deploy         # apply migrations
npm run db:seed           # admin / admin123
npm run dev               # http://localhost:3000
```

Change the default admin password after the first login (Admin → Users → reset password).

**No database?** Set `SKIP_AUTH=true` in `.env` to skip login and run UI-only (development only).

Every environment variable is documented in `.env.example` and validated at boot by `src/lib/env.ts`.

## Your first feature

Open your coding agent in the project root (Claude Code reads `CLAUDE.md`; other agents read
`AGENTS.md`) and describe the feature in product terms:

> Add an **invoices** module. An invoice has a number, a customer name, an amount, a status
> (draft / sent / paid) and a due date. Admins create and edit invoices; every signed-in user can
> see the list. Put it in the sidebar under a new "Sales" group.

The agent runs `npm run new:module invoice`, adds the Prisma model and migration, writes the
strings, validation, service, action, page and tests in the shape of the Users module, wires the
nav item, and finishes with `npm run lint:all`, `npm run test` and a check in the browser. That
sequence is spelled out in `AGENTS.md` under "How a feature is built", and the lint rules make the
layering hard to get wrong.

Doing it by hand follows the same steps: scaffold, model + `npm run db:migrate -- --name add-invoice`,
strings, validation, service, action, UI, tests, nav.

## Stack

| Layer    | Technology                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Frontend | Next.js 16 App Router, React 19 (React Compiler), Tailwind CSS 4                                                             |
| UI       | Locally owned shadcn components generated in RTL mode, one import barrel                                                     |
| Locale   | One profile (`src/lib/locale.ts`) drives direction, calendar, numerals, time zone, currency; `t()` messages; Intl formatting |
| Backend  | Server Actions + route handlers, zod validation, framework-free services                                                     |
| Database | PostgreSQL via Prisma 6, migrations committed                                                                                |
| Auth     | Cookie sessions (hashed tokens), bcrypt, login throttling, ADMIN / USER roles                                                |
| Tests    | Vitest (unit, mocked Prisma), Playwright (e2e against a real DB, locale-aware)                                               |
| Ops      | Docker multi-stage image, docker-compose, GitHub Actions CI, Renovate                                                        |

## Project structure

```
src/
  app/
    layout.tsx        document shell (html/body, font, theme, direction)
    (auth)/login/     bare pages
    (app)/            authenticated shell; admin/ is admin-only
      admin/users/    ← reference module UI
    api/health/       readiness probe (no auth)
  actions/            server actions: authorise → validate → service → revalidate
  services/           business logic, framework-free
  components/         ui/ primitives · UiComponents.tsx barrel · layout/ shell
  lib/                locale, t, format, persian, validators, validations, env, auth, prisma, …
  messages/           index.ts + the project's one dictionary (fa.ts or en.ts)
  __tests__/          unit tests, factories, prisma mock
prisma/               schema, migrations, seed · prisma.config.ts at the root
e2e/                  Playwright config and specs
scripts/              new-module.mjs scaffold · rtl-smoke-check.mjs
docs/                 PRD, decision records, checklists
.claude/              settings.json + vendored skills for Claude Code
AGENTS.md             rules for any coding agent · CLAUDE.md adds the Claude workflow
```

The **Users** module (`lib/validations/user.ts` → `services/user.service.ts` → `actions/user.actions.ts`
→ `app/(app)/admin/users/`) is the pattern every feature copies. `npm run new:module <name>` scaffolds
a new one in the same shape; `AGENTS.md` walks through the steps.

## Common tasks

| I want to…                          | Do this                                                                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a feature module                | `npm run new:module <name>`, then follow the printed next steps (see "Your first feature").                                                                               |
| Add a page                          | Create `src/app/(app)/<route>/page.tsx`. It is behind login automatically; call `requireAuth()` in the page and read data through a service.                              |
| Add an admin-only page              | Put it under `src/app/(app)/admin/`; that layout runs `requireAdmin()`. Call it in the page too (layouts and pages render in parallel).                                   |
| Add a table                         | Add the model to `prisma/schema.prisma`, run `npm run db:migrate -- --name <change>`, commit the migration folder.                                                        |
| Add a user-facing string            | Add a key to the dictionary in `src/messages/`, read it with `t('key')` (or `tp()` for plurals). Never inline text.                                                       |
| Add a form                          | `react-hook-form` + `zodResolver` + `FormField`, schema in `src/lib/validations/`. Copy `src/app/(app)/admin/users/create-user-dialog.tsx`.                               |
| Add a shadcn component              | `npx shadcn@latest add <name>` (`components.json` is in RTL mode), export it from `src/components/UiComponents.tsx`, then `npm run lint:rtl` to catch physical utilities. |
| Add a sidebar item                  | Edit `NAV_GROUPS` in `src/lib/navigation.ts`; the header title follows.                                                                                                   |
| Change the app name or logo         | `src/lib/app-config.ts` (name, description) and `src/components/layout/Logo.tsx` (mark).                                                                                  |
| Change the brand colours            | The hue/saturation variables at the top of `src/app/globals.css`.                                                                                                         |
| Change the seeded admin             | Set `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` before `npm run db:seed`, or reset the password from Admin → Users after login.                                         |
| Run e2e beside a running dev server | `PORT=3001 npm run test:e2e`                                                                                                                                              |
| Update dependencies                 | `npm run deps:update` (minor/patch) or `npm run deps:update:major` (interactive). Renovate opens the same PRs weekly.                                                     |

## Scripts

| Command                                                                      | Description                                                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev` / `build` / `start`                                            | Development server / production build / serve the build                             |
| `npm run new:module <name>`                                                  | Scaffold validation, service, action, page, client island and test                  |
| `npm run lint` · `lint:rtl` · `typecheck` · `format`                         | ESLint · logical-direction and UI-boundary check · `tsc` · Prettier                 |
| `npm run lint:all`                                                           | All of the above (CI gate)                                                          |
| `npm run test` · `test:watch` · `test:coverage`                              | Vitest                                                                              |
| `npm run test:e2e`                                                           | Playwright (needs Postgres; `PORT=3001 npm run test:e2e` beside another dev server) |
| `npm run db:up`                                                              | Start Postgres with docker compose                                                  |
| `npm run db:migrate` · `db:deploy` · `db:seed` · `db:studio` · `db:generate` | Prisma                                                                              |
| `npm run deps:update` · `deps:update:major` · `reinstall`                    | Dependency upkeep                                                                   |

## Locale and direction

| Profile        | Direction | Intl tag | Calendar  | Numerals       | Time zone     | Currency             |
| -------------- | --------- | -------- | --------- | -------------- | ------------- | -------------------- |
| `fa` (default) | RTL       | `fa-IR`  | Jalali    | Persian digits | `Asia/Tehran` | IRR (shown as toman) |
| `en`           | LTR       | `en-US`  | Gregorian | Latin digits   | `UTC`         | USD                  |

`setup.sh --locale fa|en` picks one: it keeps that dictionary in `src/messages/`, deletes the other, and
writes the profile into `src/lib/locale.ts`. `--locale en` also removes the Persian-only parts: the font,
the input normaliser, the Iranian validators, the RTL checklist, the RTL lint and the RTL rules in
`AGENTS.md`. From then on there is one language and one file to add strings to. `<html lang dir>`, the `DirectionProvider`, the font, Playwright's browser locale, every
formatter and every `t()` string follow the profile. Rules that keep this working (logical utilities,
`side="start|end"`, `t()` for all strings, `<Ltr>` for inline Latin) are in `AGENTS.md` and enforced by
`npm run lint:rtl`.

The boilerplate repository itself carries both dictionaries and builds and tests both profiles in CI
(`NEXT_PUBLIC_LOCALE` overrides the profile there); that override is removed from a project's
`.env.example` by `setup.sh`.

## Working with AI agents

- **Claude Code**: `CLAUDE.md` holds the workflow and the tooling table. `.claude/settings.json`
  pre-approves the safe commands and denies destructive Prisma commands. Skills under `.claude/skills/`
  are vendored with attribution (`SOURCE.md` in each).
- **Other agents** (Cursor, Codex, Copilot): read `AGENTS.md`.
- Framework docs matching the installed Next.js version are in `node_modules/next/dist/docs/`.
- `docs/decisions/` explains why the big choices were made, so nobody has to re-derive them.

## What to keep, what to delete

After `./setup.sh`, the project is yours. A guide to the parts that are examples versus infrastructure:

| Path                                                                                 | Keep or delete?                                                                                                                              |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(app)/admin/users/*`, `services/user.service.ts`, `actions/user.actions.ts` | **Keep.** Working admin user management; most apps need it. Also the reference pattern.                                                      |
| `src/app/(app)/components/page.tsx`                                                  | **Keep for reference**, or delete when you have your own pages. It is the visual regression surface for both directions and is behind login. |
| `src/app/(app)/page.tsx`                                                             | **Replace.** Placeholder dashboard.                                                                                                          |
| `src/lib/validators/iran.ts`, `src/lib/persian.ts`                                   | Keep if you handle Iranian identifiers or Persian input; otherwise delete along with their tests. (`--locale en` already removed them.)      |
| `docs/rtl-fa-checklist.md`                                                           | Persian-language RTL review checklist. (`--locale en` already removed it.)                                                                   |
| `docs/decisions/*`                                                                   | Keep; add your own as you diverge.                                                                                                           |
| `.claude/skills/*`                                                                   | Keep if you use Claude Code; otherwise delete `.claude/` entirely.                                                                           |
| Default admin `admin` / `admin123`                                                   | **Change on first login.** `prisma/seed.ts` reads `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` if you want different defaults.              |

## Troubleshooting

| Symptom                                                                     | Cause and fix                                                                                                                                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci` fails with "lockfile out of sync" or "Cannot find native binding"  | An incremental `npm install` dropped optional platform packages from the lockfile (npm bug). Run `npm run reinstall`, which regenerates it from a clean install. |
| `npm run build` fails with "Invalid environment variables: DATABASE_URL"    | The build evaluates `src/lib/env.ts`. Any syntactically valid `postgresql://` URL will do; it is not connected to during the build.                              |
| `npm run db:up` fails: port 5432 already in use                             | A local Postgres is running. Either use it (edit `DATABASE_URL` in `.env`) or change the host port in `docker-compose.yml`.                                      |
| Direction, calendar or strings look wrong after editing `src/lib/locale.ts` | The profile is inlined at build time. Restart `npm run dev` or rebuild.                                                                                          |
| `npm run test:e2e` says the browser is missing                              | `npx playwright install chromium` once per machine.                                                                                                              |
| Prisma engine download fails (blocked network)                              | Set `PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma` before `npm ci`; the Dockerfile already does.                                         |
| `apt-get` fails inside `docker build`                                       | Uncomment one of the Debian mirrors at the top of the `Dockerfile`.                                                                                              |
| A page renders a raw key like `invoices.title`                              | The key is missing from the dictionary. Development also logs `[t] missing message key`.                                                                         |
| ESLint: "import of `@/services/...` is restricted"                          | Components and client islands may not touch services or Prisma. Read through a server `page.tsx` and pass data down, or call a server action.                    |
| `npm run lint:rtl` rejects `ml-`, `pl-`, `left-`, `side="left"`             | Use logical utilities (`ms-`, `ps-`, `start-`) and `side="start \| end"` so the layout works in both directions.                                                 |

## Deployment

`docker compose up --build` builds the standalone image, waits for Postgres, runs `prisma migrate deploy`
and starts the server. The image exposes `/api/health` for orchestrator probes. CI
(`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, build, the e2e suite against a Postgres
service, and a Docker image build on every push and pull request. Renovate (`renovate.json`) groups
dependency updates weekly.

## Placeholders

`setup.sh` replaces `{{PROJECT_NAME}}` everywhere it appears (package.json, docker-compose.yml,
`src/lib/app-config.ts`, LICENSE, CLAUDE.md, AGENTS.md, README.md, docs/PRD.md), then removes the
boilerplate's git history and makes the first commit.

## License

MIT. See `LICENSE`. Vendored skills carry their own licenses inside `.claude/skills/*/`.
