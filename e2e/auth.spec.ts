import { expect, test } from '@playwright/test';
import { ADMIN, login } from './helpers/auth';

test.describe('authentication', () => {
  test('anonymous visitors are sent to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'ورود به سامانه' })).toBeVisible();
  });

  test('wrong password shows an error and stays on /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('نام کاربری').fill(ADMIN.username);
    await page.getByLabel('رمز عبور', { exact: true }).fill('definitely-wrong');
    await page.getByRole('button', { name: 'ورود' }).click();

    await expect(page.getByTestId('login-error')).toContainText(
      'نام کاربری یا رمز عبور اشتباه است',
    );
    await expect(page).toHaveURL(/\/login$/);
  });

  test('valid login lands on the dashboard and logout returns to /login', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { level: 2, name: 'داشبورد' })).toBeVisible();

    // Header user menu → خروج (submits a server action).
    await page.getByRole('button', { name: new RegExp(ADMIN.username) }).click();
    await page.getByRole('menuitem', { name: 'خروج' }).click();
    await expect(page).toHaveURL(/\/login$/);

    // The session cookie is gone: the dashboard redirects again.
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('a stale session cookie shows the login page instead of looping', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'session', value: 'f'.repeat(64), domain: 'localhost', path: '/' },
    ]);
    const response = await page.goto('/login');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'ورود به سامانه' })).toBeVisible();

    // And protected pages bounce to /login exactly once.
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logged-in users visiting /login are redirected home', async ({ page }) => {
    await login(page);
    await page.goto('/login');
    await expect(page).toHaveURL('/');
  });
});
