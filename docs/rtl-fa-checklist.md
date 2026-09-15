# چک‌لیست بومی‌سازی (Locale) و جهت‌گیری

هر پروژه یک زبان دارد که هنگام راه‌اندازی با `setup.sh --locale fa|en` انتخاب می‌شود: فارسی (`fa`)، راست‌به‌چپ (`rtl`) و با تقویم جلالی (پیش‌فرض)، یا انگلیسی، چپ‌به‌راست و میلادی. هیچ‌جای اپ نباید خودش تصمیم بگیرد که «الان RTL هستیم یا نه»؛ همه از پروفایل لوکال می‌خوانند.

## قواعد اجباری

1. پروفایل لوکال، منبع حقیقت

- `src/lib/locale.ts` تنها جای تعریف زبان، جهت، تقویم، سیستم اعداد، منطقهٔ زمانی، ساختار هفته و واحد پول است (`locale`, `isRtl`, `intlTag()`).
- هاردکد کردن `'rtl'`، `'fa-IR'`، ارقام فارسی یا نام تقویم در کد اپ ممنوع است.
- پروفایل فعال در `src/lib/locale.ts` (`FALLBACK_LOCALE`) ثبت شده است. متغیر `NEXT_PUBLIC_LOCALE` فقط در مخزن بویلرپلیت (که هر دو دیکشنری را دارد) برای آزمودن پروفایل دیگر به کار می‌رود و در زمان build خوانده می‌شود.

2. ریشه اپ

- در `src/app/layout.tsx` باید `<html lang={locale.lang} dir={locale.dir}>` و `<DirectionProvider>` در ریشه باقی بماند (اسکریپت smoke این را چک می‌کند).
- فونت Yekan Bakh فقط زیر `[lang="fa"]` در `globals.css` اعمال می‌شود؛ پروفایل `en` روی فونت سیستم اجرا می‌شود.

3. لایه UI

- وارد کردن مستقیم پریمیتیوهای UI (`@radix-ui/*`، `sonner`، `react-day-picker`، `input-otp`) خارج از `src/components/ui/**` ممنوع است (خطای ESLint و شکست smoke test).
- فقط از wrapperهای داخلی استفاده شود:
  - `@/components/UiComponents`
  - `@/components/ui/*`

4. کلاس‌های منطقی (نه فیزیکی)

- ممنوع: `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `border-l`, `border-r`, `rounded-l*`, `rounded-r*`, `text-left`, `text-right`
- جایگزین: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `border-s`, `border-e`, `rounded-s*`, `rounded-e*`, `text-start`, `text-end`
- کلاس‌هایی که عمداً برای یک جهت نوشته می‌شوند (`rtl:*` / `ltr:*`) مجازند.

5. `side` منطقی برای Overlayها

- در `TooltipContent`، `PopoverContent`، `DropdownMenuContent` و `SheetContent` فقط از `side="start"` یا `side="end"` (و `top` / `bottom`) استفاده شود.
- `side="left"` / `side="right"` در کد اپ ممنوع است؛ نگاشت به سمت فیزیکی داخل `src/components/ui/direction.tsx` (`resolveSide`) انجام می‌شود.

6. آیکون‌های جهت‌دار

- فلش‌ها و chevronها: `rtl:rotate-180`
- آیکون‌های پنل/چیدمان (مثل سایدبار): `rtl:-scale-x-100`
- آیکون‌های بدون جهت (جست‌وجو، تنظیمات، …) نباید flip شوند.

7. متن‌های لاتین داخل متن راست‌به‌چپ

- کد، شماره تلفن، ایمیل، URL و شبا را در `<Ltr>` (از `@/components/UiComponents`) بگذارید تا bidi آن‌ها را نشکند.
- برای پاراگراف‌های ترکیبی (فارسی + عدد/لاتین) کلاس `bidi-plaintext` (`unicode-bidi: plaintext`) استفاده شود.

8. ورودی‌های متنی آزاد

- روی `Input` / `Textarea`های متن آزاد `dir="auto"` بگذارید تا جهت با محتوای کاربر تعیین شود.
- قبل از اعتبارسنجی یا ذخیره، ورودی را با `normalizeInput` از `@/lib/persian` نرمال کنید (ارقام فارسی/عربی → لاتین، «ي/ك» عربی → «ی/ک» فارسی). برای موارد جزئی‌تر `normalizeDigits` و `normalizePersianChars` هست.
- شناسه‌های ایرانی با `@/lib/validators/iran` چک می‌شوند: `isValidNationalId`، `isValidMobile` (+ `normalizeMobile`)، `isValidSheba`، `isValidCardNumber`، `isValidPostalCode`.

9. اعداد، تاریخ و مبلغ در خروجی

- همه از `@/lib/format` عبور کنند: `formatNumber`، `formatCurrency`، `formatDate`، `formatDateTime`، `formatRelative`، `formatList`، `plural`، `sortBy`.
- پیش‌فرض همه از پروفایل می‌آید (در `fa`: ارقام فارسی، تقویم جلالی، تومان)؛ استثناها با override هر فراخوانی داده می‌شوند.
- `toLocaleString()` مستقیم یا جایگزینی دستی ارقام ممنوع است.

10. رشته‌های رابط کاربری

- هر متن قابل‌مشاهده برای کاربر از `t('key')` / `tp('key', count)` در `@/lib/t` خوانده می‌شود و در دیکشنری پروژه در `src/messages/` تعریف می‌شود.
- رشتهٔ فارسی یا انگلیسی inline در کامپوننت‌ها ننویسید.

11. تقویم

- `Calendar` و `DatePicker` از پروفایل پیروی می‌کنند (جلالی در `fa`، میلادی در `en`).
- فیلدی که باید تقویم دیگری نشان دهد (مثلاً تاریخ انقضای پاسپورت در اپ فارسی) فقط prop `calendar` را می‌گیرد؛ کد جداگانه نسازید. آداپتور تقویم lazy بارگذاری می‌شود.

## Smoke Test

قبل از merge این دستور اجرا شود:

```bash
npm run lint:all
```

خروجی `RTL smoke check passed.` باید دیده شود. این اسکریپت (`scripts/rtl-smoke-check.mjs`) کلاس‌های فیزیکی، `side` فیزیکی، import پریمیتیوها خارج از `src/components/ui/**` و ریشهٔ layout را چک می‌کند.

## بررسی بصری و e2e

- `src/app/components/page.tsx` (مسیر `/components`) سطح مرجع رگرسیون بصری برای هر دو جهت است؛ هر کامپوننت جدید باید آنجا نمونه داشته باشد (در مخزن بویلرپلیت، یک بار هم با `NEXT_PUBLIC_LOCALE=en` دیده شود).
- `e2e/locale.spec.ts` در پروفایل فعال، `lang`/`dir` ریشه، جهت محاسبه‌شدهٔ `body`، نبود overflow افقی و قرارگیری سایدبار در سمت inline-start را روی `/` و `/components` چک می‌کند. لوکال و منطقهٔ زمانی مرورگر در `e2e/playwright.config.ts` از همان پروفایل خوانده می‌شود.
