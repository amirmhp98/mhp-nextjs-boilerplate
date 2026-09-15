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
  'users.subtitle': 'ایجاد، ویرایش و غیرفعال‌سازی حساب‌های کاربری سامانه',
  'users.empty': 'هنوز کاربری ثبت نشده است.',
  'users.you': '(شما)',
  'users.role.ADMIN': 'مدیر',
  'users.role.USER': 'کاربر',
  'users.status.active': 'فعال',
  'users.status.inactive': 'غیرفعال',
  'users.column.fullName': 'نام کامل',
  'users.column.username': 'نام کاربری',
  'users.column.role': 'نقش',
  'users.column.status': 'وضعیت',
  'users.column.lastLogin': 'آخرین ورود',
  'users.column.actions': 'عملیات',
  'users.rowActions': 'عملیات برای {name}',
  'users.action.new': 'کاربر جدید',
  'users.action.edit': 'ویرایش',
  'users.action.resetPassword': 'بازنشانی رمز عبور',
  'users.action.deactivate': 'غیرفعال‌سازی',
  'users.action.activate': 'فعال‌سازی',
  'users.action.cancel': 'انصراف',
  'users.action.save': 'ذخیره',
  'users.action.create': 'ایجاد کاربر',
  'users.action.reset': 'بازنشانی',
  'users.field.fullName': 'نام کامل',
  'users.field.username': 'نام کاربری',
  'users.field.usernameHint': 'حروف لاتین، عدد، نقطه، خط تیره و زیرخط',
  'users.field.password': 'رمز عبور',
  'users.field.newPassword': 'رمز عبور جدید',
  'users.field.role': 'نقش',
  'users.field.ownRoleHint': 'نقش خودتان قابل تغییر نیست',
  'users.create.title': 'کاربر جدید',
  'users.create.description': 'حساب کاربری جدیدی برای دسترسی به سامانه بسازید.',
  'users.edit.title': 'ویرایش کاربر',
  'users.reset.title': 'بازنشانی رمز عبور',
  'users.reset.description':
    'رمز جدیدی برای «{name}» تعیین کنید. همهٔ نشست‌های فعال این کاربر بسته می‌شود.',
  'users.toast.created': 'کاربر ایجاد شد',
  'users.toast.saved': 'تغییرات ذخیره شد',
  'users.toast.passwordReset': 'رمز عبور بازنشانی شد؛ کاربر باید دوباره وارد شود',
  'users.toast.deactivated': 'کاربر غیرفعال شد',
  'users.toast.activated': 'کاربر فعال شد',
  'users.errors.usernameTaken': 'این نام کاربری قبلاً استفاده شده است',
  'users.errors.notFound': 'کاربر یافت نشد',
  'users.errors.cannotChangeOwnRole': 'نمی‌توانید نقش خود را تغییر دهید',
  'users.errors.cannotDeactivateSelf': 'نمی‌توانید حساب خود را غیرفعال کنید',

  // ── Validation (zod messages, shared by server and client) ─
  'validation.required': 'این فیلد الزامی است',
  'validation.invalid': 'ورودی نامعتبر است',
  'validation.usernameRequired': 'نام کاربری الزامی است',
  'validation.passwordRequired': 'رمز عبور الزامی است',
  'validation.usernameMin': 'نام کاربری باید حداقل {min} کاراکتر باشد',
  'validation.usernameMax': 'نام کاربری حداکثر {max} کاراکتر است',
  'validation.usernameChars': 'فقط حروف لاتین، عدد، نقطه، خط تیره و زیرخط مجاز است',
  'validation.passwordMin': 'رمز عبور باید حداقل {min} کاراکتر باشد',
  'validation.passwordMax': 'رمز عبور حداکثر {max} کاراکتر است',
  'validation.fullNameMin': 'نام کامل الزامی است',
  'validation.fullNameMax': 'نام کامل حداکثر {max} کاراکتر است',
  'validation.roleInvalid': 'نقش نامعتبر است',
  'validation.userIdInvalid': 'شناسه کاربر نامعتبر است',

  // ── Generic action errors ──────────────────────────────────
  'errors.unexpected': 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.',
  'errors.notFound': 'موردی یافت نشد',
  'auth.errors.tooManyAttempts':
    'تلاش‌های ناموفق زیاد است. {minutes} دقیقه دیگر دوباره امتحان کنید.',

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
