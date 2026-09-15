/**
 * Iran-specific identifier validators. Pure functions: each normalizes
 * Persian/Arabic digits first, strips whitespace and hyphens, and returns a
 * boolean. Nullish or non-string-like inputs are simply invalid.
 */
import { normalizeDigits } from '@/lib/persian';

type Nullable<T> = T | null | undefined;

function clean(input: Nullable<string>): string {
  return normalizeDigits(input).replace(/[\s-]/g, '');
}

/** "1111111111", "aaaa" … — every character identical. */
function isRepeated(text: string): boolean {
  return /^(.)\1*$/.test(text);
}

/**
 * Iranian national ID (کد ملی): 10 digits with a mod-11 check digit.
 * All-same-digit sequences pass the checksum but are rejected as fake.
 */
export function isValidNationalId(input: Nullable<string>): boolean {
  const id = clean(input);
  if (!/^\d{10}$/.test(id) || isRepeated(id)) return false;
  const digits = Array.from(id, Number);
  const sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);
  const remainder = sum % 11;
  const check = digits[9];
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

/** Country prefix (+98 / 0098 / 98) or trunk 0 is optional; the subscriber part is 9 + 9 digits. */
const MOBILE_PATTERN = /^(?:\+98|0098|98|0)?(9\d{9})$/;

/**
 * Canonical `09xxxxxxxxx` for 09…, +989…, 00989…, 989… and bare 9… inputs,
 * or null when the input is not an Iranian mobile number.
 */
export function normalizeMobile(input: Nullable<string>): string | null {
  const match = MOBILE_PATTERN.exec(clean(input));
  return match ? `0${match[1]}` : null;
}

export function isValidMobile(input: Nullable<string>): boolean {
  return normalizeMobile(input) !== null;
}

/** ISO 7064 mod 97-10 remainder, digit by digit so no BigInt is needed. */
function mod97(text: string): number {
  let remainder = 0;
  for (const char of text) {
    // Letters map to two digits: A=10 … Z=35.
    const piece = char >= 'A' && char <= 'Z' ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of piece) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder;
}

/** IBAN / شبا: "IR" + 24 digits, ISO 7064 check (spaces and lowercase tolerated). */
export function isValidSheba(input: Nullable<string>): boolean {
  const iban = clean(input).toUpperCase();
  if (!/^IR\d{24}$/.test(iban)) return false;
  return mod97(iban.slice(4) + iban.slice(0, 4)) === 1;
}

/** Bank card: 16 digits passing the Luhn check (spaces and hyphens tolerated). */
export function isValidCardNumber(input: Nullable<string>): boolean {
  const card = clean(input);
  if (!/^\d{16}$/.test(card)) return false;
  let sum = 0;
  for (let i = 0; i < card.length; i++) {
    let digit = Number(card[i]);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Postal code: 10 digits, first digit not 0, not all the same digit. */
export function isValidPostalCode(input: Nullable<string>): boolean {
  const code = clean(input);
  return /^[1-9]\d{9}$/.test(code) && !isRepeated(code);
}
