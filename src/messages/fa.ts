/**
 * Persian (fa-IR) UI strings — the source dictionary.
 *
 * Flat, dot-namespaced keys grouped by screen. `en.ts` must provide every key
 * defined here (enforced by its type annotation). Plural strings come in
 * `<base>.one` / `<base>.other` pairs and are read through `tp()`.
 * Placeholders use `{name}` and are filled by `t()` / `tp()`.
 */
export const fa = {
  // ── App shell ──────────────────────────────────────────────
  'shell.skipToContent': 'رفتن به محتوای اصلی',
  'shell.logoAlt': 'لوگو',
  'shell.openMenu': 'منوی ناوبری',
  'shell.expandSidebar': 'باز کردن منوی کناری',
  'shell.collapseSidebar': 'بستن منوی کناری',
  'shell.adminBadge': 'مدیر',
  'shell.adminRole': 'مدیر سیستم',

  // ── Navigation (sidebar) ───────────────────────────────────
  'nav.menuTitle': 'منوی ناوبری',
  'nav.group.dashboard': 'داشبورد',
  'nav.group.tools': 'ابزارها',
  'nav.group.admin': 'مدیریت',
  'nav.home': 'خانه',
  'nav.components': 'کامپوننت‌ها',
  'nav.users': 'کاربران',
  'nav.comingSoon': 'به‌زودی',

  // ── Theme toggle ───────────────────────────────────────────
  'theme.switchToLight': 'حالت روشن',
  'theme.switchToDark': 'حالت تاریک',

  // ── Auth ───────────────────────────────────────────────────
  'auth.logout': 'خروج',
  'auth.login.title': 'ورود به سامانه',
  'auth.login.username': 'نام کاربری',
  'auth.login.usernamePlaceholder': 'نام کاربری خود را وارد کنید',
  'auth.login.password': 'رمز عبور',
  'auth.login.passwordPlaceholder': 'رمز عبور خود را وارد کنید',
  'auth.login.showPassword': 'نمایش رمز عبور',
  'auth.login.hidePassword': 'پنهان کردن رمز عبور',
  'auth.login.submit': 'ورود',
  'auth.login.submitting': 'در حال ورود...',
  'auth.errors.missingCredentials': 'نام کاربری و رمز عبور الزامی است',
  'auth.errors.invalidCredentials': 'نام کاربری یا رمز عبور اشتباه است',

  // ── Home ───────────────────────────────────────────────────
  'home.title': 'داشبورد',
  'home.welcome': 'خوش آمدید، {name}',
  'home.gettingStarted.title': 'شروع کنید',
  'home.gettingStarted.description':
    'این داشبورد آماده سفارشی‌سازی است. ماژول‌های خود را اضافه کنید و محتوای این صفحه را به‌روزرسانی نمایید.',

  // ── Component library (header title only; the page itself is a dev showcase) ──
  'components.title': 'کتابخانه کامپوننت‌ها',

  // ── Admin › Users ──────────────────────────────────────────
  'users.title': 'مدیریت کاربران',
  'users.placeholder': 'پنل مدیریت کاربران را اینجا پیاده‌سازی کنید.',
  'users.errors.allFieldsRequired': 'تمام فیلدها الزامی هستند',
  'users.errors.passwordTooShort': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
  'users.errors.usernameTaken': 'این نام کاربری قبلاً استفاده شده است',
  'users.errors.notFound': 'کاربر یافت نشد',
  'users.errors.cannotChangeOwnRole': 'نمی‌توانید نقش خود را تغییر دهید',
  'users.errors.cannotDeactivateSelf': 'نمی‌توانید حساب خود را غیرفعال کنید',

  // ── Error boundary ─────────────────────────────────────────
  'error.title': 'خطایی رخ داد',
  'error.description': 'مشکلی در بارگذاری این صفحه پیش آمده است. لطفاً دوباره تلاش کنید.',
  'error.code': 'کد خطا: {digest}',
  'error.retry': 'تلاش مجدد',

  // ── Not found ──────────────────────────────────────────────
  'notFound.code': '۴۰۴',
  'notFound.title': 'صفحه یافت نشد',
  'notFound.description': 'صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.',
  'notFound.backHome': 'بازگشت به خانه',

  // ── UI primitives ──────────────────────────────────────────
  'ui.close': 'بستن',
  'ui.loading': 'در حال بارگذاری',
  'ui.pagination.label': 'صفحه‌بندی',
  'ui.pagination.previous': 'قبلی',
  'ui.pagination.next': 'بعدی',
  'ui.pagination.morePages': 'صفحات بیشتر',
  'ui.itemCount.one': '{count} مورد',
  'ui.itemCount.other': '{count} مورد',
  'ui.datePicker.placeholder': 'انتخاب تاریخ',
  'ui.datePicker.rangePlaceholder': 'انتخاب بازهٔ زمانی',
  'ui.datePicker.rangeLabel': '{from} تا {to}',
} as const;
