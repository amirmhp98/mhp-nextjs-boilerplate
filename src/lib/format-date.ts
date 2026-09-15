import { APP_LOCALE } from '@/lib/i18n';

const TIME_ZONE = 'Asia/Tehran';

const dateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: TIME_ZONE,
});

const dateTimeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});

/** Jalali date, e.g. «۲۴ شهریور ۱۴۰۵». Empty string for null. */
export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  return dateFormatter.format(new Date(value));
}

/** Jalali date and time, e.g. «۲۴ شهریور ۱۴۰۵، ۱۴:۰۵». Empty string for null. */
export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '';
  return dateTimeFormatter.format(new Date(value));
}
