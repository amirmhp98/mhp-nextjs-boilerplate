# CLAUDE.md - {{PROJECT_NAME}}

## Workflow

- Keep changes scoped to what was asked. If you discover related work, mention it rather than doing it.
- Before reporting done: `npm run build` (includes TypeScript checks) and `npm run lint:all` for non-trivial changes. Say what you tested.
- `docs/PRD.md` describes what the product is and does. When a change adds a route, module, or user-visible behaviour, update it in a sentence or two — it is a living reference, not a changelog.

### Optional: issue tracking with beads

If the project uses [beads](https://github.com/steveyegge/beads) (a `.beads/` directory exists), track work there:

```bash
bd ready                    # Work with no blockers
bd create --title="..." --description="..." --type=task --priority=2
bd update <id> --claim      # Mark in_progress
bd close <id> --reason="..."  # Only after the user confirms
```

Do not use `bd edit` (opens an interactive editor). If there is no `.beads/` directory, skip this section entirely.

---

## Critical Coding Rules

### UI & Layout
- **Locale profile is the source of truth**: `src/lib/locale.ts` (`locale`, `isRtl`, `intlTag()`, selected by `NEXT_PUBLIC_LOCALE` at build time) decides language, direction, calendar, numerals, time zone, week, and currency. Never hardcode `'rtl'`, `'fa-IR'`, Persian digits, or a calendar — read the profile.
- **Logical utilities only**: `ms/me/ps/pe/start/end/border-s/border-e/rounded-s/rounded-e/text-start/text-end`. Never `ml/mr/pl/pr/left-/right-/border-l/border-r/rounded-l/rounded-r/text-left/text-right` (`npm run lint:rtl` fails on them).
- **Overlays take logical sides**: `side="start" | "end"` on `TooltipContent`, `PopoverContent`, `DropdownMenuContent`, `SheetContent` (plus `top`/`bottom`). Never `side="left"` / `"right"` in app code.
- **Directional icons flip**: chevrons/arrows get `rtl:rotate-180`; panel/layout icons get `rtl:-scale-x-100`.
- **Strings**: user-facing text goes through `t(key, params?)` / `tp(key, count)` from `@/lib/t` and lives in `src/messages/{fa,en}.ts`. No inline Persian or English literals in components.
- **Numbers, dates, currency**: format with `@/lib/format` (`formatNumber`, `formatCurrency`, `formatDate`, `formatDateTime`, `formatRelative`, `formatList`, `plural`, `sortBy`). Defaults come from the profile; pass per-call overrides for exceptions. Never `toLocaleString()` or manual digit swapping.
- **Calendar**: `Calendar` / `DatePicker` follow the profile (Jalali for `fa`, Gregorian for `en`); a field that must show another calendar passes the `calendar` prop — never a second code path.
- **Free-text input**: normalize with `@/lib/persian` (`normalizeInput`, `normalizeDigits`, `normalizePersianChars`) before validating or persisting; put `dir="auto"` on free-text inputs. Iranian identifiers are validated with `@/lib/validators/iran` (`isValidNationalId`, `isValidMobile` + `normalizeMobile`, `isValidSheba`, `isValidCardNumber`, `isValidPostalCode`).
- **Inline Latin runs** (codes, phone numbers, emails, URLs, IBANs) inside RTL text are wrapped in `<Ltr>` from `@/components/UiComponents`.
- **UI import boundary**: app code imports UI only from `@/components/UiComponents` or `@/components/ui/*`. `@radix-ui/*`, `sonner`, `react-day-picker`, `input-otp` may be imported inside `src/components/ui/**` only (ESLint error + `lint:rtl` failure elsewhere).
- **Imports**: Use `@/*` path alias. Never relative paths that go more than one level up.

### Database
- Never run `prisma db push --force-reset`; if a migration warns about data loss, stop and review.
- Add domain models to `prisma/schema.prisma` and create a migration with `npx prisma migrate dev --name <change>`.

### Architecture
- **Services** (`src/services/`) hold all business logic — never put it in components or actions.
- **Server Actions** (`src/actions/`) are thin wrappers that call services.
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files.

---

## Tooling

Reach for these when the context matches; skip them for trivial edits.

| Tool | When to use |
|------|-------------|
| **Context7 MCP** | Before writing code against Next.js, React, Tailwind, Prisma, or any npm library API — fetch current docs first. |
| **Prisma MCP** | Schema, migration, or data-model questions — introspect before editing `schema.prisma` by hand. |
| **Playwright MCP** | Testing or verifying the running app in a browser at `localhost:3000`. |
| `/next-best-practices` | Creating or modifying pages, layouts, routes, server components, metadata, error/loading states, API routes. |
| `/shadcn` | Adding or composing shadcn/ui components. |
| `/ui-ux-pro-max` | Design decisions — palette, spacing, layout, responsive, dark mode, RTL. |
| `/playwright-best-practices` | Writing or fixing Playwright tests. |
| `/webapp-testing` | Visual verification of the running app. |
| `/supabase-postgres-best-practices` | SQL, indexes, schema performance. |
| `/simplify` | After a non-trivial implementation, review the diff for reuse and simplification. |
