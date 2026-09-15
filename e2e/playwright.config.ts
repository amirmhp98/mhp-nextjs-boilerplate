import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests run against a real dev server and a real Postgres.
 * Locally: `npm run db:up && npm run db:deploy && npm run db:seed && npm run test:e2e`.
 * Override PORT to run beside another dev server (e.g. in a worktree).
 */
const PORT = process.env.PORT ?? '3000';
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: '.',
  outputDir: '../test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    locale: 'fa-IR',
    timezoneId: 'Asia/Tehran',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      // Auth flow tests log in and out themselves — no stored state.
      name: 'auth',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      testIgnore: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
