/**
 * CareNet Currency Utilities — per D019 §4.3
 *
 * Bangladesh uses South Asian number grouping:
 *   - Last three digits grouped, then groups of two
 *   - Example: 12,34,567 (not 1,234,567)
 *
 * Supports both English (1,23,456) and Bangla (১,২৩,৪৫৬) numeral output.
 */

const BANGLA_DIGITS = ["\u09E6", "\u09E7", "\u09E8", "\u09E9", "\u09EA", "\u09EB", "\u09EC", "\u09ED", "\u09EE", "\u09EF"];

/**
 * Format a number with South Asian (Indian/Bangladeshi) grouping.
 * e.g. 1234567 -> "12,34,567"
 */
function southAsianGroup(numStr: string): string {
  if (numStr.length <= 3) return numStr;

  const last3 = numStr.slice(-3);
  const rest = numStr.slice(0, -3);

  const pairs: string[] = [];
  for (let i = rest.length; i > 0; i -= 2) {
    pairs.unshift(rest.slice(Math.max(0, i - 2), i));
  }

  return pairs.join(",") + "," + last3;
}

/**
 * Convert digits to Bangla numerals.
 */
function toBanglaDigits(str: string): string {
  return str.replace(/[0-9]/g, (d) => BANGLA_DIGITS[parseInt(d)]);
}

export interface FormatBDTOptions {
  /** Use Bangla numerals */
  bangla?: boolean;
  /** Show paisa (decimal places), default false */
  showPaisa?: boolean;
  /** Show positive sign for credits */
  showSign?: boolean;
  /** Compact display for large amounts (e.g. ৳ 1.5L) */
  compact?: boolean;
}

/**
 * Format amount as BDT with South Asian grouping.
 *
 * @example
 * formatBDT(1234567)        -> "৳ 12,34,567"
 * formatBDT(1234567, { bangla: true }) -> "৳ ১২,৩৪,৫৬৭"
 * formatBDT(21760, { showPaisa: true }) -> "৳ 21,760.00"
 * formatBDT(150000, { compact: true }) -> "৳ 1.5L"
 */
export function formatBDT(amount: number, options: FormatBDTOptions = {}): string {
  const { bangla = false, showPaisa = false, showSign = false, compact = false } = options;
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (compact && abs >= 100000) {
    let val: string;
    if (abs >= 10000000) {
      val = (abs / 10000000).toFixed(abs % 10000000 === 0 ? 0 : 1) + "C";
    } else {
      val = (abs / 100000).toFixed(abs % 100000 === 0 ? 0 : 1) + "L";
    }
    const sign = isNegative ? "-" : showSign ? "+" : "";
    return bangla ? `\u09F3 ${sign}${toBanglaDigits(val)}` : `\u09F3 ${sign}${val}`;
  }

  let formatted: string;
  if (showPaisa) {
    const intPart = Math.floor(abs);
    const decPart = Math.round((abs - intPart) * 100).toString().padStart(2, "0");
    formatted = southAsianGroup(intPart.toString()) + "." + decPart;
  } else {
    formatted = southAsianGroup(Math.round(abs).toString());
  }

  const sign = isNegative ? "-" : showSign ? "+" : "";

  if (bangla) {
    return `\u09F3 ${sign}${toBanglaDigits(formatted)}`;
  }
  return `\u09F3 ${sign}${formatted}`;
}

/**
 * Parse a BDT formatted string back to a number.
 */
export function parseBDT(str: string): number {
  const cleaned = str
    .replace(/\u09F3/g, "")
    .replace(/,/g, "")
    .replace(/[\u09E6-\u09EF]/g, (d) => String(BANGLA_DIGITS.indexOf(d)))
    .trim();
  return parseFloat(cleaned) || 0;
}
