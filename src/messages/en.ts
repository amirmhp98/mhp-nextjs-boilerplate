import type { fa } from '@/messages/fa';

/**
 * English (en-US) UI strings.
 *
 * Typed against the Persian dictionary so a key that exists in `fa.ts` but is
 * missing here fails type-checking. Keys are identical; only the text differs.
 */
export const en: Record<keyof typeof fa, string> = {
  // ── App shell ──────────────────────────────────────────────
  'shell.skipToContent': 'Skip to main content',
  'shell.logoAlt': 'Logo',
  'shell.openMenu': 'Open navigation menu',
  'shell.expandSidebar': 'Expand sidebar',
  'shell.collapseSidebar': 'Collapse sidebar',
  'shell.adminBadge': 'Admin',
  'shell.adminRole': 'System administrator',

  // ── Navigation (sidebar) ───────────────────────────────────
  'nav.menuTitle': 'Navigation menu',
  'nav.group.dashboard': 'Dashboard',
  'nav.group.tools': 'Tools',
  'nav.group.admin': 'Administration',
  'nav.home': 'Home',
  'nav.components': 'Components',
  'nav.users': 'Users',
  'nav.comingSoon': 'Coming soon',

  // ── Theme toggle ───────────────────────────────────────────
  'theme.switchToLight': 'Switch to light mode',
  'theme.switchToDark': 'Switch to dark mode',

  // ── Auth ───────────────────────────────────────────────────
  'auth.logout': 'Log out',
  'auth.login.title': 'Sign in',
  'auth.login.username': 'Username',
  'auth.login.usernamePlaceholder': 'Enter your username',
  'auth.login.password': 'Password',
  'auth.login.passwordPlaceholder': 'Enter your password',
  'auth.login.showPassword': 'Show password',
  'auth.login.hidePassword': 'Hide password',
  'auth.login.submit': 'Sign in',
  'auth.login.submitting': 'Signing in…',
  'auth.errors.missingCredentials': 'Username and password are required.',
  'auth.errors.invalidCredentials': 'Incorrect username or password.',

  // ── Home ───────────────────────────────────────────────────
  'home.title': 'Dashboard',
  'home.welcome': 'Welcome, {name}',
  'home.gettingStarted.title': 'Get started',
  'home.gettingStarted.description':
    'This dashboard is ready to customize. Add your modules and update the content of this page.',

  // ── Component library ──────────────────────────────────────
  'components.title': 'Component Library',

  // ── Admin › Users ──────────────────────────────────────────
  'users.title': 'User Management',
  'users.placeholder': 'Build the user management panel here.',
  'users.errors.allFieldsRequired': 'All fields are required.',
  'users.errors.passwordTooShort': 'Password must be at least 6 characters.',
  'users.errors.usernameTaken': 'This username is already taken.',
  'users.errors.notFound': 'User not found.',
  'users.errors.cannotChangeOwnRole': "You can't change your own role.",
  'users.errors.cannotDeactivateSelf': "You can't deactivate your own account.",

  // ── Error boundary ─────────────────────────────────────────
  'error.title': 'Something went wrong',
  'error.description': 'We couldn’t load this page. Please try again.',
  'error.code': 'Error code: {digest}',
  'error.retry': 'Try again',

  // ── Not found ──────────────────────────────────────────────
  'notFound.code': '404',
  'notFound.title': 'Page not found',
  'notFound.description': 'The page you’re looking for doesn’t exist or has been moved.',
  'notFound.backHome': 'Back to home',

  // ── UI primitives ──────────────────────────────────────────
  'ui.close': 'Close',
  'ui.loading': 'Loading',
  'ui.pagination.label': 'Pagination',
  'ui.pagination.previous': 'Previous',
  'ui.pagination.next': 'Next',
  'ui.pagination.morePages': 'More pages',
  'ui.itemCount.one': '{count} item',
  'ui.itemCount.other': '{count} items',
  'ui.datePicker.placeholder': 'Pick a date',
  'ui.datePicker.rangePlaceholder': 'Pick a date range',
  'ui.datePicker.rangeLabel': '{from} – {to}',
};
