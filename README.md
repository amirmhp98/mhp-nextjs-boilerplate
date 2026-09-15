# {{PROJECT_NAME}}

Locale-profile-driven web application boilerplate built with Next.js 16, React 19, Tailwind CSS 4, and Prisma. Persian / RTL / Jalali by default; English / LTR / Gregorian with a single env var.

## Quick Start

```bash
# 1. Run the setup script (replaces placeholders, installs deps)
./setup.sh

# 2. Configure your database
#    Edit .env with your PostgreSQL connection string

# 3. Create database tables
npx prisma migrate dev --name init

# 4. Seed default admin user
npm run db:seed

# 5. Start development server
npm run dev
```

Default admin credentials: `admin` / `admin123`

### No Database? No Problem

Set `SKIP_AUTH=true` in `.env` to bypass authentication and run without a database. Useful for UI development and component previewing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | Next.js Server Actions + API Routes |
| Database | PostgreSQL via Prisma ORM |
| UI Components | Locally owned shadcn components generated in RTL mode (logical classes), re-exported from `@/components/UiComponents` |
| Locale | One profile (`src/lib/locale.ts`) drives direction, calendar, numerals, time zone, currency; Intl-based formatting in `@/lib/format` |
| Auth | Cookie-based sessions with bcrypt |
| Deployment | Docker (standalone Next.js output) |

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  actions/       # Server actions (thin wrappers calling services)
  services/      # Business logic (add your domain logic here)
  components/
    ui/          # Base UI components (Button, Card, Input, etc.)
    layout/      # Layout components (Sidebar, Header, ThemeToggle)
    common/      # Shared components (SectionHeader)
    UiComponents.tsx  # Barrel — the only UI import surface for app code
  lib/
    locale.ts    # Locale profile (lang, dir, calendar, numerals, tz, currency)
    format.ts    # Intl formatting: numbers, currency, dates, relative time, lists, plural
    persian.ts   # Input normalization: digits, Arabic/Persian characters
    t.ts         # t() / tp() message lookup
    validators/  # Iranian identifiers (national ID, mobile, SHEBA, card, postal code)
    ...          # auth, prisma, logger, fonts, theme
  messages/      # User-facing strings per locale (fa.ts, en.ts)
  types/         # TypeScript type definitions
prisma/          # Database schema and seed
e2e/             # Playwright end-to-end tests
docs/            # PRD and checklists
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:rtl` | Locale smoke check: physical utilities, physical `side` props, UI import boundary |
| `npm run lint:all` | Run all linters |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run db:seed` | Seed the default admin user |
| `npm run deps:update` | Bump all dependencies to latest minor/patch and install |
| `npm run deps:update:major` | Interactive picker for major upgrades |

## Features

- **Locale profile** — One config (`src/lib/locale.ts`) sets language, direction, calendar, numerals, time zone, and currency. RTL Persian with the Jalali calendar and Yekan Bakh by default; LTR English with the Gregorian calendar via `NEXT_PUBLIC_LOCALE=en`
- **Dark & Light mode** — Theme toggle with localStorage persistence, no flash
- **Authentication** — Cookie-based session auth with `ADMIN` / `USER` roles
- **Component library** — Battle-tested UI components at `/components`
- **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Docker ready** — Dockerfile with standalone output, docker-compose template

## Locale & Direction

Everything locale-related reads one profile from `src/lib/locale.ts`:

| Profile | Direction | Intl tag | Calendar | Numerals | Time zone | Currency |
|---------|-----------|----------|----------|----------|-----------|----------|
| `fa` (default) | RTL | `fa-IR` | Jalali | Persian digits | `Asia/Tehran` | IRR (shown as toman) |
| `en` | LTR | `en-US` | Gregorian | Latin digits | `UTC` | USD |

- **Switching** — set `NEXT_PUBLIC_LOCALE=en` in `.env` (or the environment) and rebuild / restart `npm run dev`. It is inlined at build time, so one deployment runs one profile. `<html lang dir>`, the root `DirectionProvider`, the font (Yekan Bakh under `[lang="fa"]`), Playwright's browser locale and time zone, and every formatter follow it.
- **Strings** — `t('key')` / `tp('key', count)` from `@/lib/t`, backed by `src/messages/{fa,en}.ts`.
- **Numbers, dates, currency** — `formatNumber`, `formatCurrency`, `formatDate`, `formatDateTime`, `formatRelative`, `formatList`, `plural`, `sortBy` from `@/lib/format`. All default to the profile and accept per-call overrides.
- **Per-field calendar** — `Calendar` / `DatePicker` follow the profile; pass `calendar="gregory"` (or `"persian"`) on a single field that must differ, e.g. a passport expiry date inside the Persian app. The adapter is lazy-loaded.
- **Input** — normalize free text with `normalizeInput` from `@/lib/persian` (Persian/Arabic digits and characters to a canonical form); Iranian identifiers are checked with `@/lib/validators/iran`. Wrap inline Latin runs (codes, phones, emails) in `<Ltr>` inside RTL text.
- **Lint guard** — `npm run lint:rtl` (part of `npm run lint:all`) fails on physical utilities (`ml/mr/pl/pr/left-/right-/border-l/r/rounded-l/r/text-left/right`), physical `side="left|right"` props, and UI primitives imported outside `src/components/ui/**`. ESLint enforces the same import boundary.
- **Verification** — `/components` is the visual regression surface for both directions; `e2e/locale.spec.ts` asserts `lang`/`dir`, computed direction, no horizontal overflow, and sidebar placement for the active profile.

## Keeping dependencies current

- **Node**: `.nvmrc` is `lts/*` and the Dockerfile uses `node:lts-slim`, so both follow the current LTS line automatically. `engines.node` is `>=22`.
- **Packages**: `renovate.json` is included. Enable [Renovate](https://docs.renovatebot.com/) on the repo (GitHub app or GitLab bot) and it opens a single weekly PR for minor/patch bumps (auto-merged when checks pass) and one PR per major for review. Without a bot, run `npm run deps:update` periodically.

## Placeholders

The following placeholders are replaced by `setup.sh`:

| Placeholder | Where | What |
|---|---|---|
| `{{PROJECT_NAME}}` | package.json, layout.tsx, CLAUDE.md, docker-compose.yml, docs/PRD.md | Project name (kebab-case) |

## Architecture Rules

- **Services** hold all business logic — never in components or actions
- **Server Actions** are thin wrappers calling services
- **UI imports** always go through `@/components/UiComponents` or `@/components/ui/*`
- **Path alias** `@/*` maps to `./src/*` — no deep relative imports
- **Database** — never `prisma db push --force-reset`; migrations via `prisma migrate dev`
