import { describe, expect, it } from 'vitest';
import { isNavItemActive, pageTitleFor, visibleNavGroups } from '@/lib/navigation';
import { sessionCookieOptions } from '@/lib/session-cookie';

describe('navigation', () => {
  it('hides admin groups from plain users and shows them to admins', () => {
    const userTitles = visibleNavGroups({ role: 'USER' }).map((g) => g.title);
    const adminTitles = visibleNavGroups({ role: 'ADMIN' }).map((g) => g.title);
    expect(userTitles).not.toContain('مدیریت');
    expect(adminTitles).toContain('مدیریت');
  });

  it('matches the home item only on the exact path', () => {
    expect(isNavItemActive('/', '/')).toBe(true);
    expect(isNavItemActive('/', '/admin/users')).toBe(false);
    expect(isNavItemActive('/admin/users', '/admin/users/123')).toBe(true);
    expect(isNavItemActive('/admin', '/administration')).toBe(false);
  });

  it('derives the header title from the longest matching item', () => {
    expect(pageTitleFor('/')).toBe('خانه');
    expect(pageTitleFor('/admin/users')).toBe('کاربران');
    expect(pageTitleFor('/nothing-here')).toBe('');
  });
});

describe('sessionCookieOptions', () => {
  it('is http-only, lax and scoped to the whole site', () => {
    const expires = new Date();
    expect(sessionCookieOptions(expires)).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires,
    });
  });
});
