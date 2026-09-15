#!/usr/bin/env bash
set -euo pipefail

# ─── Boilerplate setup ────────────────────────────────────────────────────
# Turns this checkout into a fresh project:
#   1. replaces {{PROJECT_NAME}} everywhere
#   2. drops the boilerplate's git history and issue tracker
#   3. creates .env, installs dependencies, generates the Prisma client
#   4. makes the first commit
# Safe to run only once; it refuses to run on an already-initialised project.

BOLD='\033[1m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'
say()  { echo -e "${CYAN}$*${NC}"; }
ok()   { echo -e "  ${GREEN}✓${NC} $*"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $*"; }

cd "$(dirname "$0")"

echo -e "${BOLD}${GREEN}🔧 Project setup${NC}\n"

if ! grep -q '"name": "{{PROJECT_NAME}}"' package.json; then
  echo "This project has already been initialised (package.json name is not the placeholder)."
  exit 1
fi

# ─── Project name ─────────────────────────────────────────────────────────
PROJECT_NAME="${1:-}"
if [[ -z "$PROJECT_NAME" ]]; then
  read -r -p "Project name (kebab-case, e.g. my-new-project): " PROJECT_NAME
fi
if [[ ! "$PROJECT_NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Error: project name must be kebab-case (lowercase letters, digits, single dashes)."
  exit 1
fi

# ─── Replace placeholders ─────────────────────────────────────────────────
say "Replacing placeholders..."
grep -rl --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
  --exclude-dir=.claude --exclude-dir=.beads --exclude=setup.sh \
  '{{PROJECT_NAME}}' . \
  | xargs perl -pi -e "s/\\{\\{PROJECT_NAME\\}\\}/$PROJECT_NAME/g"
ok "{{PROJECT_NAME}} → $PROJECT_NAME"

# ─── Fresh history ────────────────────────────────────────────────────────
say "Resetting repository state..."
rm -rf .git .beads
git init -q
ok "New git repository"

# ─── Environment ──────────────────────────────────────────────────────────
if [[ ! -f .env ]]; then
  cp .env.example .env
  ok ".env created from .env.example"
else
  warn ".env already exists, left untouched"
fi

# ─── Dependencies ─────────────────────────────────────────────────────────
say "Installing dependencies..."
npm ci --no-audit --no-fund
npx prisma generate
ok "Dependencies installed, Prisma client generated"

# ─── Issue tracker ────────────────────────────────────────────────────────
if command -v bd >/dev/null 2>&1; then
  say "Initialising beads..."
  bd init --quiet >/dev/null 2>&1 && ok "beads initialised" || warn "bd init failed; run it manually later"
else
  warn "beads CLI (bd) not found — install it to use the issue-tracking workflow in CLAUDE.md"
fi

# bd init appends a section to AGENTS.md / CLAUDE.md; keep them Prettier-clean.
npx prettier --write AGENTS.md CLAUDE.md >/dev/null 2>&1 || true

# ─── First commit ─────────────────────────────────────────────────────────
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-setup}" -c user.email="${GIT_AUTHOR_EMAIL:-setup@localhost}" \
  commit -q -m "Initial commit from boilerplate"
ok "Initial commit"

# ─── Done ─────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}${GREEN}✅ '$PROJECT_NAME' is ready.${NC}\n"
echo "Next steps:"
echo "  1. Review .env (DATABASE_URL points at the docker-compose Postgres by default)"
echo "  2. npm run db:up        # start Postgres"
echo "  3. npm run db:deploy    # apply migrations"
echo "  4. npm run db:seed      # create admin / admin123"
echo "  5. npm run dev"
echo ""
echo "Then open CLAUDE.md / AGENTS.md before asking an agent to build features."
