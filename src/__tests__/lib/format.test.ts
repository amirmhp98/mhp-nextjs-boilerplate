import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime } from '@/lib/format-date';
import { formatCompactNumber, formatNumber } from '@/lib/format-number';

describe('formatNumber', () => {
  it('uses Persian digits and grouping', () => {
    expect(formatNumber(1234567)).toBe('۱٬۲۳۴٬۵۶۷');
  });

  it('treats null as zero', () => {
    expect(formatNumber(null)).toBe('۰');
    expect(formatNumber(undefined)).toBe('۰');
  });
});

describe('formatCompactNumber', () => {
  it('leaves small numbers alone', () => {
    expect(formatCompactNumber(842)).toBe('۸۴۲');
  });

  it('compacts thousands and millions with Persian words', () => {
    expect(formatCompactNumber(54_400)).toMatch(/هزار/);
    expect(formatCompactNumber(1_340_000)).toMatch(/میلیون/);
  });
});

describe('formatDate', () => {
  it('renders Jalali dates in Persian', () => {
    // 2024-03-20 is Nowruz 1403.
    expect(formatDate(new Date('2024-03-20T12:00:00Z'))).toBe('۱ فروردین ۱۴۰۳');
  });

  it('returns an empty string for null', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDateTime(undefined)).toBe('');
  });
});
