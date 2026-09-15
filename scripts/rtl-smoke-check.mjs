#!/usr/bin/env node
// Fast, dependency-free guard for the direction/locale rules
// (see docs/rtl-fa-checklist.md). Runs in `npm run lint:all`.

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const uiDir = path.normalize('src/components/ui') + path.sep;
const scanExt = new Set(['.ts', '.tsx', '.js', '.jsx']);

// UI primitives are only allowed inside src/components/ui/**.
const restrictedImportRegex =
  /from\s+['"](?:@radix-ui\/[^'"]+|sonner|react-day-picker(?:\/[^'"]+)?|input-otp)['"]/;

// Physical direction utilities, with any variant prefix (md:, hover:, …).
const physicalWithSuffixRegex =
  /(^|[\s"'`{(:])((?:ml|mr|pl|pr|left|right|inset-l|inset-r|scroll-ml|scroll-mr|scroll-pl|scroll-pr|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)-[^\s"'`})]+)/g;
const physicalBareRegex =
  /(^|[\s"'`{(:])(border-l|border-r|rounded-l|rounded-r|text-left|text-right|float-left|float-right)(?=[\s"'`})]|$)/g;

// Physical `side` props on app-level overlays; use start/end instead.
const physicalSidePropRegex = /\bside=["'](left|right)["']/;

const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(absolute);
      continue;
    }
    if (!scanExt.has(path.extname(entry.name))) continue;
    checkFile(absolute);
  }
}

function addViolation(filePath, lineNumber, message) {
  const rel = path.relative(projectRoot, filePath);
  violations.push(`${rel}:${lineNumber} ${message}`);
}

function checkFile(filePath) {
  const rel = path.normalize(path.relative(projectRoot, filePath));
  const isUiPrimitive = rel.startsWith(uiDir);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const lineNumber = i + 1;

    if (!isUiPrimitive && restrictedImportRegex.test(raw)) {
      addViolation(
        filePath,
        lineNumber,
        "UI primitives may only be imported in src/components/ui/**. Use '@/components/UiComponents' or '@/components/ui/*'.",
      );
    }

    if (!isUiPrimitive && physicalSidePropRegex.test(raw)) {
      addViolation(
        filePath,
        lineNumber,
        `Physical side prop is forbidden. Use side="start" or side="end".`,
      );
    }

    // Tokens deliberately scoped to one direction (rtl:… / ltr:…) are allowed.
    const line = raw.replace(/\b(?:rtl|ltr):[^\s"'`]+/g, '');

    for (const regex of [physicalWithSuffixRegex, physicalBareRegex]) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        addViolation(
          filePath,
          lineNumber,
          `Physical direction utility '${match[2]}' is forbidden. Use logical utilities (ms/me/ps/pe/start/end/border-s/border-e/text-start).`,
        );
      }
    }
  }
}

function checkLayoutDefaults() {
  const layoutPath = path.join(srcRoot, 'app', 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    violations.push('src/app/layout.tsx:1 Missing root layout file.');
    return;
  }
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (!layoutContent.includes('lang={locale.lang}')) {
    violations.push(
      'src/app/layout.tsx:1 Root <html> must use lang={locale.lang} from @/lib/locale.',
    );
  }
  if (!layoutContent.includes('dir={locale.dir}')) {
    violations.push(
      'src/app/layout.tsx:1 Root <html> must use dir={locale.dir} from @/lib/locale.',
    );
  }
  if (!layoutContent.includes('<DirectionProvider')) {
    violations.push('src/app/layout.tsx:1 Root layout must wrap the app in <DirectionProvider>.');
  }
}

walk(srcRoot);
checkLayoutDefaults();

if (violations.length > 0) {
  console.error('RTL smoke check failed:\n');
  for (const item of violations) console.error(`- ${item}`);
  process.exit(1);
}

console.log('RTL smoke check passed.');
