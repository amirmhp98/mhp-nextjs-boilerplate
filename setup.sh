#!/bin/bash
set -e

# ─── Project Boilerplate Setup ─────────────────────────────────────────────────────────
# This script initializes a new project from the boilerplate.
# It replaces all {{PLACEHOLDERS}} and sets up the environment.

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BOLD}${GREEN}🔧 Project Boilerplate Setup${NC}\n"

# ─── Collect project info ─────────────────────────────────────

read -p "Project name (kebab-case, e.g. my-new-project): " PROJECT_NAME
if [[ -z "$PROJECT_NAME" ]]; then
  echo "Error: Project name is required."
  exit 1
fi

# ─── Replace placeholders ────────────────────────────────────

echo -e "\n${CYAN}Replacing placeholders...${NC}"

# macOS-compatible sed (uses -i '' instead of -i)
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD="sed -i ''"
else
  SED_CMD="sed -i"
fi

find . -type f \( -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.md" -o -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" -o -name "*.sh" -o -name "*.css" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.claude/skills/*" \
  -exec $SED_CMD "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" {} \; 2>/dev/null

# Clean up macOS sed backup files
find . -name "*''" -delete 2>/dev/null

echo "  ✓ Placeholders replaced"

# ─── Environment file ─────────────────────────────────────────

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "  ✓ Created .env from .env.example (edit with your database credentials)"
else
  echo "  ⏭ .env already exists, skipping"
fi

# ─── Install dependencies ─────────────────────────────────────

echo -e "\n${CYAN}Installing dependencies...${NC}"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi
echo "  ✓ Dependencies installed"

# ─── Generate Prisma client ──────────────────────────────────

echo -e "\n${CYAN}Generating Prisma client...${NC}"
npx prisma generate
echo "  ✓ Prisma client generated"

# ─── Initialize Git ───────────────────────────────────────────

echo -e "\n${CYAN}Initializing Git repository...${NC}"
if [[ ! -d .git ]]; then
  git init
  git add -A
  git commit -m "Initial project from boilerplate"
  echo "  ✓ Git initialized with initial commit"
else
  echo "  ⏭ Git already initialized"
fi

# ─── Done ─────────────────────────────────────────────────────

echo -e "\n${BOLD}${GREEN}✅ Project '$PROJECT_NAME' is ready!${NC}\n"
echo "Next steps:"
echo "  1. Edit .env with your database credentials"
echo "  2. Run: npx prisma migrate dev --name init"
echo "  3. Run: npm run db:seed"
echo "  4. Run: npm run dev"
echo ""
echo "Default admin credentials: admin / admin123"
echo ""
