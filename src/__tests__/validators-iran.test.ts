import { describe, it, expect } from 'vitest';
import {
  isValidCardNumber,
  isValidMobile,
  isValidNationalId,
  isValidPostalCode,
  isValidSheba,
  normalizeMobile,
} from '@/lib/validators/iran';

describe('isValidNationalId', () => {
  it('accepts a valid id, including Persian digits and separators', () => {
    expect(isValidNationalId('0013542419')).toBe(true);
    expect(isValidNationalId('۰۰۱۳۵۴۲۴۱۹')).toBe(true);
    expect(isValidNationalId('001-354241-9')).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(isValidNationalId('0013542418')).toBe(false);
  });

  it('rejects all-same digits even though they pass the checksum', () => {
    expect(isValidNationalId('1111111111')).toBe(false);
    expect(isValidNationalId('0000000000')).toBe(false);
  });

  it('rejects wrong length, non-digits and nullish', () => {
    expect(isValidNationalId('001354241')).toBe(false);
    expect(isValidNationalId('00135424190')).toBe(false);
    expect(isValidNationalId('abcdefghij')).toBe(false);
    expect(isValidNationalId('')).toBe(false);
    expect(isValidNationalId(null)).toBe(false);
    expect(isValidNationalId(undefined)).toBe(false);
  });
});

describe('isValidMobile / normalizeMobile', () => {
  it.each([
    '09123456789',
    '+989123456789',
    '00989123456789',
    '989123456789',
    '9123456789',
    '۰۹۱۲۳۴۵۶۷۸۹',
    '0912 345 6789',
    '0912-345-6789',
  ])('accepts %s and normalizes it to 09123456789', (input) => {
    expect(isValidMobile(input)).toBe(true);
    expect(normalizeMobile(input)).toBe('09123456789');
  });

  it.each([
    '08123456789',
    '0912345678',
    '091234567890',
    '+981123456789',
    'abc',
    '',
    null,
    undefined,
  ])('rejects %s', (input) => {
    expect(isValidMobile(input)).toBe(false);
    expect(normalizeMobile(input)).toBeNull();
  });
});

describe('isValidSheba', () => {
  it('accepts IBANs that pass the mod-97 check', () => {
    expect(isValidSheba('IR870620000000202601181001')).toBe(true);
    expect(isValidSheba('IR062960000000100324200001')).toBe(true);
  });

  it('tolerates spaces, lowercase and Persian digits', () => {
    expect(isValidSheba('IR87 0620 0000 0020 2601 1810 01')).toBe(true);
    expect(isValidSheba('ir870620000000202601181001')).toBe(true);
    expect(isValidSheba('IR۸۷۰۶۲۰۰۰۰۰۰۰۲۰۲۶۰۱۱۸۱۰۰۱')).toBe(true);
  });

  it('rejects a bad checksum, wrong length, other countries and nullish', () => {
    expect(isValidSheba('IR062960000000100324200002')).toBe(false);
    expect(isValidSheba('IR87062000000020260118100')).toBe(false);
    expect(isValidSheba('DE870620000000202601181001')).toBe(false);
    expect(isValidSheba('870620000000202601181001')).toBe(false);
    expect(isValidSheba('')).toBe(false);
    expect(isValidSheba(null)).toBe(false);
  });
});

describe('isValidCardNumber', () => {
  it('accepts 16-digit numbers passing Luhn', () => {
    expect(isValidCardNumber('6037991234567893')).toBe(true);
    expect(isValidCardNumber('6104337844856789')).toBe(true);
  });

  it('tolerates separators and Persian digits', () => {
    expect(isValidCardNumber('6037-9912-3456-7893')).toBe(true);
    expect(isValidCardNumber('6037 9912 3456 7893')).toBe(true);
    expect(isValidCardNumber('۶۰۳۷۹۹۱۲۳۴۵۶۷۸۹۳')).toBe(true);
  });

  it('rejects a failed Luhn check, wrong length and nullish', () => {
    expect(isValidCardNumber('6037991234567891')).toBe(false);
    expect(isValidCardNumber('603799123456789')).toBe(false);
    expect(isValidCardNumber('60379912345678930')).toBe(false);
    expect(isValidCardNumber('')).toBe(false);
    expect(isValidCardNumber(undefined)).toBe(false);
  });
});

describe('isValidPostalCode', () => {
  it('accepts 10 digits not starting with 0', () => {
    expect(isValidPostalCode('1234567890')).toBe(true);
    expect(isValidPostalCode('۱۲۳۴۵۶۷۸۹۰')).toBe(true);
    expect(isValidPostalCode('12345-67890')).toBe(true);
  });

  it('rejects a leading zero, repeated digits, wrong length and nullish', () => {
    expect(isValidPostalCode('0123456789')).toBe(false);
    expect(isValidPostalCode('1111111111')).toBe(false);
    expect(isValidPostalCode('123456789')).toBe(false);
    expect(isValidPostalCode('12345678901')).toBe(false);
    expect(isValidPostalCode('')).toBe(false);
    expect(isValidPostalCode(null)).toBe(false);
  });
});
