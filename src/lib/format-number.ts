import { APP_LOCALE } from '@/lib/i18n';

const standard = new Intl.NumberFormat(APP_LOCALE);
const compact = new Intl.NumberFormat(APP_LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Persian digits with grouping, e.g. ۱٬۲۳۴٬۵۶۷. «۰» for null. */
export function formatNumber(value: number | null | undefined): string {
  return standard.format(value ?? 0);
}

/** Compact Persian notation for dashboards, e.g. ۵۴٫۴ هزار / ۱٫۳ میلیون. */
export function formatCompactNumber(value: number | null | undefined): string {
  return compact.format(value ?? 0);
}
