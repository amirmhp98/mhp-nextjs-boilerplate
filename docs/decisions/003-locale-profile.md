# 003 — One locale profile per deployment, strings through `t()`

**Decision.** `src/lib/locale.ts` holds one active profile (language, direction, calendar, numerals,
time zone, week, currency) selected by `NEXT_PUBLIC_LOCALE` at build time. All user-facing strings are
keys in `src/messages/{fa,en}.ts` read through `t()` / `tp()`. Formatting goes through `@/lib/format`.
Layout uses logical CSS only.

**Why.** The default product is Persian, RTL and Jalali, but the same code must run as an English LTR
app without a rewrite. A build-time profile keeps `t()` free of hooks and contexts, so it works
identically in server components, client components, server actions and Playwright specs. It also
removes a whole category of bugs: no component decides for itself what "right" means or how to render
a digit.

**Consequences.** One deployment serves one locale; per-user language switching would need a runtime
provider and is out of scope. Every new string needs two dictionary entries (TypeScript enforces that
`en.ts` has every key `fa.ts` has). The e2e suite reads its locators through `t()`, so it passes for
either profile.
