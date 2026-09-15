import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// UI primitives may only be imported inside src/components/ui/**.
// App code goes through '@/components/UiComponents' or '@/components/ui/*'
// so RTL/LTR behaviour, direction, and locale stay consistent.
// Bare package specifiers only (our own '@/components/ui/sonner' must stay allowed).
const UI_PRIMITIVE_REGEX = "^(@radix-ui/|sonner$|react-day-picker(/|$)|input-otp$)";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: UI_PRIMITIVE_REGEX,
              message:
                "Import UI from '@/components/UiComponents' or '@/components/ui/*' so RTL/LTR and locale behaviour stay consistent.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local tooling and generated output, not project code:
    ".claude/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
