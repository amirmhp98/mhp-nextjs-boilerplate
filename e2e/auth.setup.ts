import path from 'node:path';
import { test as setup } from '@playwright/test';
import { login } from './helpers/auth';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate as admin', async ({ page }) => {
  await login(page);
  await page.context().storageState({ path: authFile });
});
