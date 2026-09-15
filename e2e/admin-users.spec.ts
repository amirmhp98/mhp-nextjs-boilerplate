import { expect, test, type Page } from '@playwright/test';

/**
 * Exercises the reference Users module end-to-end as the seeded admin.
 * Each run creates a uniquely named user so the suite is re-runnable.
 */
const stamp = Date.now().toString(36);
const newUser = {
  username: `e2e_${stamp}`,
  fullName: `کاربر آزمایشی ${stamp}`,
  password: 'e2e-password-1',
};

function row(page: Page) {
  return page.getByTestId(`user-row-${newUser.username}`);
}

async function openRowMenu(page: Page) {
  await row(page)
    .getByRole('button', { name: /عملیات/ })
    .click();
}

test.describe.serial('admin › users', () => {
  test('the users page lists the seeded admin', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'مدیریت کاربران' })).toBeVisible();
    await expect(page.getByTestId('user-row-admin')).toContainText('(شما)');
  });

  test('create a user through the dialog', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('button', { name: 'کاربر جدید' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('نام کامل').fill(newUser.fullName);
    await dialog.getByLabel('نام کاربری').fill(newUser.username);
    await dialog.getByLabel('رمز عبور').fill(newUser.password);
    await dialog.getByRole('button', { name: 'ایجاد کاربر' }).click();

    await expect(dialog).toBeHidden();
    await expect(row(page)).toBeVisible();
    await expect(row(page)).toContainText('تحلیلگر');
    await expect(row(page)).toContainText('فعال');
  });

  test('client-side validation blocks a short password', async ({ page }) => {
    await page.goto('/admin/users');
    await page.getByRole('button', { name: 'کاربر جدید' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('نام کامل').fill('کسی');
    await dialog.getByLabel('نام کاربری').fill(`x_${stamp}`);
    await dialog.getByLabel('رمز عبور').fill('123');
    await dialog.getByRole('button', { name: 'ایجاد کاربر' }).click();

    await expect(dialog.getByText('رمز عبور باید حداقل ۸ کاراکتر باشد')).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test('edit changes the name and role', async ({ page }) => {
    await page.goto('/admin/users');
    await openRowMenu(page);
    await page.getByRole('menuitem', { name: 'ویرایش' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('نام کامل').fill(`${newUser.fullName} (ویرایش‌شده)`);
    await dialog.getByLabel('نقش').click();
    await page.getByRole('option', { name: 'مدیر' }).click();
    await dialog.getByRole('button', { name: 'ذخیره' }).click();

    await expect(dialog).toBeHidden();
    await expect(row(page)).toContainText('ویرایش‌شده');
    await expect(row(page)).toContainText('مدیر');
  });

  test('reset password closes the dialog with a success toast', async ({ page }) => {
    await page.goto('/admin/users');
    await openRowMenu(page);
    await page.getByRole('menuitem', { name: 'بازنشانی رمز عبور' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('رمز عبور جدید').fill('another-password-2');
    await dialog.getByRole('button', { name: 'بازنشانی' }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByText('رمز عبور بازنشانی شد')).toBeVisible();
  });

  test('deactivate flips the status badge; the admin cannot deactivate themselves', async ({
    page,
  }) => {
    await page.goto('/admin/users');
    await openRowMenu(page);
    await page.getByRole('menuitem', { name: 'غیرفعال‌سازی' }).click();
    await expect(row(page)).toContainText('غیرفعال');

    await page
      .getByTestId('user-row-admin')
      .getByRole('button', { name: /عملیات/ })
      .click();
    await expect(page.getByRole('menuitem', { name: 'غیرفعال‌سازی' })).toBeDisabled();
  });
});

// Runs after the serial block above (workers: 1) with no admin cookie.
test.describe('admin › users › deactivated account', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('a deactivated user cannot log in', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('نام کاربری').fill(newUser.username);
    await page.getByLabel('رمز عبور', { exact: true }).fill('another-password-2');
    await page.getByRole('button', { name: 'ورود' }).click();
    await expect(page.getByTestId('login-error')).toContainText(
      'نام کاربری یا رمز عبور اشتباه است',
    );
  });
});
