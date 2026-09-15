#!/usr/bin/env bash
set -euo pipefail

# ─── Boilerplate setup ────────────────────────────────────────────────────
# Turns this checkout into a fresh project:
#
#   ./setup.sh <project-name> [--locale fa|en]      (default locale: fa)
#
#   1. replaces {{PROJECT_NAME}} everywhere
#   2. keeps one language: the chosen dictionary stays, the other is deleted
#   3. for `en`, removes the Persian-only parts (font, normaliser, Iranian
#      validators, RTL lint, RTL checklist and RTL rules in AGENTS.md)
#   4. drops the boilerplate's git history and issue tracker
#   5. creates .env, installs dependencies, generates the Prisma client
#   6. makes the first commit
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

# ─── Arguments ────────────────────────────────────────────────────────────
usage() {
  echo "Usage: ./setup.sh <project-name> [--locale fa|en]"
  exit 1
}

PROJECT_NAME=""
LOCALE="fa"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --locale)
      [[ $# -ge 2 ]] || usage
      LOCALE="$2"; shift 2 ;;
    --locale=*)
      LOCALE="${1#--locale=}"; shift ;;
    -h|--help) usage ;;
    -*) echo "Unknown option: $1"; usage ;;
    *)
      [[ -z "$PROJECT_NAME" ]] || usage
      PROJECT_NAME="$1"; shift ;;
  esac
done
if [[ "$LOCALE" != "fa" && "$LOCALE" != "en" ]]; then
  echo "Error: --locale must be 'fa' or 'en' (got '$LOCALE')."
  usage
fi

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

# ─── One language ─────────────────────────────────────────────────────────
say "Keeping one language ($LOCALE)..."
if [[ "$LOCALE" == "fa" ]]; then OTHER="en"; else OTHER="fa"; fi
rm -f "src/messages/$OTHER.ts"
cat > src/messages/index.ts <<EOF
/** User-facing strings. Add a key to the dictionary and read it with t(). */
export { $LOCALE as messages } from './$LOCALE';
EOF
perl -pi -e "s/^const FALLBACK_LOCALE: LocaleId = '(fa|en)';/const FALLBACK_LOCALE: LocaleId = '$LOCALE';/" src/lib/locale.ts
grep -q "^const FALLBACK_LOCALE: LocaleId = '$LOCALE';" src/lib/locale.ts \
  || { echo "Error: could not set FALLBACK_LOCALE in src/lib/locale.ts"; exit 1; }
# The locale override only makes sense while both dictionaries exist.
perl -0pi -e 's/# ─── Locale profile.*?\nNEXT_PUBLIC_LOCALE=\w+\n\n//s' .env.example
ok "Language: $LOCALE (single dictionary at src/messages/$LOCALE.ts)"

# ─── Persian-only parts ───────────────────────────────────────────────────
# Blocks that only a Persian project needs sit between markers:
#   markdown  <!-- fa-only --> … <!-- /fa-only -->
#   css       /* fa-only:start */ … /* fa-only:end */
# `en` deletes the blocks (and the Persian-only files); `fa` just drops the markers.
MARKED_FILES=(AGENTS.md src/app/globals.css)

# strip_fa_block <file> <start-marker> <end-marker>: delete from the start marker
# line through the end marker line, plus one following blank line.
strip_fa_block() {
  START="$2" END="$3" perl -0pi -e \
    's/^[ \t]*\Q$ENV{START}\E[ \t]*\n.*?^[ \t]*\Q$ENV{END}\E[ \t]*\n\n?//msg' "$1"
}

if [[ "$LOCALE" == "en" ]]; then
  say "Removing Persian-only parts..."

  rm -rf src/app/fonts src/lib/persian.ts src/lib/validators \
    src/__tests__/persian.test.ts src/__tests__/validators-iran.test.ts \
    scripts/rtl-smoke-check.mjs docs/rtl-fa-checklist.md
  ok "Deleted the Persian font, @/lib/persian, @/lib/validators/iran, the RTL check and the RTL checklist"

  # Root layout: no local font; the Latin stack comes from globals.css.
  perl -0pi -e 's/import localFont from .next\/font\/local.;\n//; s/\/\/ Persian typeface.*?\n\}\);\n\n//s; s/className=\{`dark \$\{yekanBakh\.variable\}`\}/className="dark"/' src/app/layout.tsx
  if grep -q 'yekanBakh\|localFont' src/app/layout.tsx; then
    echo "Error: could not remove the Persian font from src/app/layout.tsx"; exit 1
  fi

  strip_fa_block AGENTS.md '<!-- fa-only -->' '<!-- /fa-only -->'
  strip_fa_block src/app/globals.css '/* fa-only:start */' '/* fa-only:end */'

  # lint:all runs without the RTL check.
  node -e '
    const fs = require("node:fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    delete pkg.scripts["lint:rtl"];
    pkg.scripts["lint:all"] = pkg.scripts["lint:all"].replace("npm run lint:rtl && ", "");
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  '

  # Prose that mentions the removed parts.
  perl -ni -e 'print unless /^\s+(persian\.ts|validators\/)\s/' AGENTS.md
  perl -pi -e 's/, rtl-smoke-check\.mjs//; s/ESLint \+ RTL check \+/ESLint +/; s/ESLint, RTL check, typecheck/ESLint, typecheck/' AGENTS.md
  perl -ni -e 'print unless /validators\/iran\.ts|rtl-fa-checklist\.md|`npm run lint:rtl` rejects/' README.md
  perl -0pi -e 's/format, persian, validators, validations/format, validations/; s/ · rtl-smoke-check\.mjs//; s/, then `npm run lint:rtl` to catch physical utilities\././; s/`npm run lint` · `lint:rtl` · `typecheck`/`npm run lint` · `typecheck`/; s/ESLint · logical-direction and UI-boundary check · `tsc`/ESLint · `tsc`/; s/ and enforced by\s+`npm run lint:rtl`\././' README.md

  if grep -rqn 'lint:rtl\|rtl-smoke-check\|rtl-fa-checklist\|lib\/persian\|validators\/iran\|fa-only' \
      README.md AGENTS.md CLAUDE.md package.json src scripts; then
    echo "Error: a Persian-only reference survived:"
    grep -rn 'lint:rtl\|rtl-smoke-check\|rtl-fa-checklist\|lib\/persian\|validators\/iran\|fa-only' \
      README.md AGENTS.md CLAUDE.md package.json src scripts
    exit 1
  fi
  ok "Persian-only rules and references removed"
else
  perl -ni -e 'print unless /^\s*(<!-- \/?fa-only -->|\/\* fa-only:(start|end) \*\/)\s*$/' "${MARKED_FILES[@]}"
  ok "Persian-only blocks kept, markers dropped"
fi

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

# bd init appends a section to AGENTS.md / CLAUDE.md, and the edits above may leave
# double blank lines or misaligned tables; keep everything Prettier-clean.
npx prettier --write AGENTS.md CLAUDE.md README.md package.json src/messages/index.ts src/lib/locale.ts \
  src/app/layout.tsx src/app/globals.css >/dev/null 2>&1 || true

# ─── First commit ─────────────────────────────────────────────────────────
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-setup}" -c user.email="${GIT_AUTHOR_EMAIL:-setup@localhost}" \
  commit -q -m "Initial commit from boilerplate"
ok "Initial commit"

# ─── Done ─────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}${GREEN}✅ '$PROJECT_NAME' is ready ($LOCALE).${NC}\n"
echo "Next steps:"
echo "  1. Review .env (DATABASE_URL points at the docker-compose Postgres by default)"
echo "  2. npm run db:up        # start Postgres"
echo "  3. npm run db:deploy    # apply migrations"
echo "  4. npm run db:seed      # create admin / admin123"
echo "  5. npm run dev"
echo ""
echo "Then open CLAUDE.md / AGENTS.md before asking an agent to build features."
