# CLAUDE.md — {{PROJECT_NAME}}

@AGENTS.md

The file above holds the architecture, layering, database, RTL and style rules.
This file adds the workflow Claude Code must follow and the tooling it should reach for.

## Beads-First Workflow (MANDATORY)

**Every task goes through beads (`bd`).** No feature, fix, or refactor without a tracked issue.

1. **Define** — `bd search "<keywords>"` or `bd list --status=open`. Reuse a matching issue, otherwise:
   `bd create --title="…" --description="what and why" --type=<bug|feature|task|chore> --priority=<0-4>`
   If the user names an issue ID, `bd show <id>` first.
2. **Claim** — `bd update <id> --claim` (marks in_progress and assigns you).
3. **Implement** — follow "How a feature is built" in AGENTS.md. Related discoveries become linked issues:
   `bd create --title="…" --description="…" --type=task --deps discovered-from:<parent-id>`. No scope creep.
4. **Verify** — `npm run lint:all`, `npm run test`, `npm run build`; exercise the change in the browser
   (Playwright MCP) or add an e2e spec. Say what you tested.
5. **Report, do not close** — tell the user what was done, what was tested, and the issue ID.
   **Never close an issue without explicit user approval.** Then `bd close <id> --reason="…"`.
6. **PRD** — after closing, update `docs/PRD.md` if product scope changed (new module, route, behaviour, data model). Bump "Last Updated".

Rules: `bd` is the only tracker (no TodoWrite, no markdown TODOs). Claim before coding. Create the issue before writing code. Never `bd edit` (opens an editor and blocks). Use `--json` when parsing output.

```bash
bd ready                    # unblocked work
bd show <id>                # details
bd update <id> --claim      # claim
bd close <id> --reason="…"  # only after user approval
bd prime                    # reload workflow context after compaction
```

## Tooling

Reach for these proactively when the context matches.

### MCP servers (configured in `.mcp.json`)

| MCP            | Use when                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Playwright** | Verifying or debugging the running app at `localhost:3000`: screenshots, form flows, console errors.                |
| **Prisma**     | Introspecting the schema, relations, or generating queries before editing `schema.prisma`.                          |
| **Context7**   | Fetching current docs for a third-party npm library. For Next.js itself, read `node_modules/next/dist/docs/` first. |

### Skills (`.claude/skills/`, invoke with `/name` or the Skill tool)

| Skill                                    | Use when                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **next-best-practices**                  | Creating or changing pages, layouts, route handlers, metadata, loading/error states, RSC boundaries.                |
| **shadcn**                               | Adding, composing, or fixing UI components. Read its "In this repo" section: imports go through the local wrappers. |
| **ui-ux-pro-max**                        | Design decisions: palette, spacing, layout, dark mode, RTL. Run its search script from the repo root.               |
| **playwright-best-practices**            | Writing or fixing e2e specs, flaky tests, CI config.                                                                |
| **webapp-testing**                       | One-off visual verification with Python Playwright scripts (the Playwright MCP is usually quicker).                 |
| **supabase-postgres-best-practices**     | Schema design, indexes, query performance. Skip the RLS/Supabase-only parts.                                        |
| **simplify**                             | After implementing: review the diff for reuse and simplification before reporting done.                             |
| **techlead** / **execbd** / **discover** | User-invoked workflows for larger features (`/techlead`, `/execbd <id>`, `/discover …`).                            |

Each vendored skill has a `SOURCE.md` with upstream repo, commit and license, and an "In this repo" section at the end of `SKILL.md`.

### Decision flow

```
Touching a route or layout?        → next-best-practices, then bundled Next docs
Touching the schema or a query?    → Prisma MCP, supabase-postgres-best-practices
Building or changing UI?           → shadcn (wrappers!), ui-ux-pro-max for design calls
Done implementing?                 → simplify, then Playwright MCP to verify in the browser
Writing tests?                     → playwright-best-practices; unit tests mirror src/__tests__/
```

## Permissions

`.claude/settings.json` allows the npm/prisma/bd commands the workflow needs and denies
destructive Prisma commands. Put personal overrides in `.claude/settings.local.json` (git-ignored).
