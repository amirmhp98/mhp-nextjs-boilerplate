import type { Page } from '@playwright/test';

export const ADMIN = {
  username: process.env.TEST_USERNAME ?? 'admin',
  password: process.env.TEST_PASSWORD ?? 'admin123',
};

/** Fill the login form and wait for the dashboard. */
export async function login(page: Page, username = ADMIN.username, password = ADMIN.password) {
  await page.goto('/login');
  await page.getByLabel('نام کاربری').fill(username);
  await page.getByLabel('رمز عبور', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.waitForURL('/');
}

/** Log out through the header user menu. */
export async function logout(page: Page) {
  await page
    .getByRole('button', { name: /عملیات|admin|مدیر/ })
    .first()
    .click();
  await page.getByRole('menuitem', { name: 'خروج' }).click();
  await page.waitForURL('/login');
}
