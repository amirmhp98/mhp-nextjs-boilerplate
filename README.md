# {{PROJECT_NAME}}

RTL-first (Persian) web application boilerplate: Next.js 16 · React 19 · Tailwind CSS 4 · Prisma 6 · PostgreSQL.
Built to be driven by AI coding agents: the architecture is enforced by lint, one complete reference
module shows the pattern, and the agent configuration ships with the repo.

## Quick start

Requirements: Node 22 (`.nvmrc`), Docker (for the local database) or any PostgreSQL 14+.

```bash
./setup.sh my-project     # replaces placeholders, resets git history, installs, creates .env
npm run db:up             # Postgres in Docker (or edit DATABASE_URL in .env)
npm run db:deploy         # apply migrations
npm run db:seed           # admin / admin123
npm run dev               # http://localhost:3000
```

Change the default admin password after the first login (Admin → Users → reset password).

**No database?** Set `SKIP_AUTH=true` in `.env` to skip login and run UI-only (development only).

## Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | Next.js 16 App Router, React 19 (React Compiler), Tailwind CSS 4 |
| Backend  | Server Actions + route handlers, zod validation                  |
| Database | PostgreSQL via Prisma 6, migrations committed                    |
| Auth     | Cookie sessions (hashed tokens), bcrypt, ADMIN / ANALYST roles   |
| Tests    | Vitest (unit, mocked Prisma), Playwright (e2e against a real DB) |
| Ops      | Docker multi-stage image, docker-compose, GitHub Actions CI      |

## Project structure

```
src/
  app/              routes (page/layout/route + client islands next to them)
    admin/users/    ← reference module UI
    api/health/     readiness probe (no auth)
  actions/          server actions: authorise → validate → service → revalidate
  services/         business logic, framework-free
  components/       ui/ primitives · UiComponents.tsx widget barrel · layout/ shell
  lib/              env, prisma, auth, logger, validations, formatting, navigation
  __tests__/        unit tests, factories, prisma mock
prisma/             schema, migrations, seed
e2e/                Playwright config and specs
docs/               PRD and checklists
.claude/            settings.json + vendored skills for Claude Code
AGENTS.md           rules for any coding agent · CLAUDE.md adds the Claude workflow
```

The **Users** module (`services/user.service.ts` → `actions/user.actions.ts` → `app/admin/users/`)
is the pattern every new feature copies. `AGENTS.md` walks through it step by step.

## Scripts

| Command                                                                      | Description                                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run dev` / `build` / `start`                                            | Development server / production build / serve the build                                    |
| `npm run lint` · `lint:rtl` · `typecheck` · `format`                         | ESLint · logical-direction check · `tsc` · Prettier                                        |
| `npm run lint:all`                                                           | All of the above (CI gate)                                                                 |
| `npm run test` · `test:watch` · `test:coverage`                              | Vitest                                                                                     |
| `npm run test:e2e`                                                           | Playwright (needs Postgres; `PORT=3001 npm run test:e2e` to run beside another dev server) |
| `npm run db:up`                                                              | Start Postgres with docker compose                                                         |
| `npm run db:migrate` · `db:deploy` · `db:seed` · `db:studio` · `db:generate` | Prisma                                                                                     |

## Working with AI agents

- **Claude Code**: `CLAUDE.md` defines the mandatory beads (`bd`) issue workflow and the tooling table.
  `.claude/settings.json` pre-approves the safe commands and denies destructive Prisma commands.
  Skills under `.claude/skills/` are vendored with attribution (`SOURCE.md` in each).
- **Other agents** (Cursor, Codex, Copilot): read `AGENTS.md`.
- Framework docs matching the installed Next.js version are in `node_modules/next/dist/docs/`.

## Conventions worth knowing

- **RTL only**: logical Tailwind utilities (`ms-`, `pe-`, `start-`…), enforced by `npm run lint:rtl`.
- **Layering is linted**: components cannot import Prisma or services; services cannot import Next or React; actions cannot import UI.
- **Database names carry a `v2_` prefix** through `@@map`; Prisma model names stay clean. Never `db push --force-reset`.
- **Env is validated** at boot by `src/lib/env.ts`; `.env.example` lists every variable.
- **Session tokens are hashed** in the database; deactivating a user or resetting a password revokes all of their sessions.

## Deployment

`docker compose up --build` builds the standalone image, waits for Postgres, runs `prisma migrate deploy`
and starts the server. The image exposes `/api/health` for orchestrator probes. CI (`.github/workflows/ci.yml`)
runs lint, typecheck, unit tests, build, and the e2e suite on every push and pull request.

## Placeholders

`setup.sh` replaces `{{PROJECT_NAME}}` in `package.json`, `docker-compose.yml`, `src/lib/app-config.ts`,
`CLAUDE.md`, `AGENTS.md`, `README.md` and `docs/PRD.md`, then removes the boilerplate's git history.
