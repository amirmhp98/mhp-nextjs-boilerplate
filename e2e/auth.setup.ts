import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  // With SKIP_AUTH=true the app serves a mock session and has no login form,
  // so the stored state is simply an empty context (no database needed).
  if (process.env.SKIP_AUTH !== 'true') {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="username"]').fill(process.env.TEST_USERNAME ?? 'admin');
    await page.locator('input[name="password"]').fill(process.env.TEST_PASSWORD ?? 'admin123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  }

  await page.context().storageState({ path: authFile });
});
