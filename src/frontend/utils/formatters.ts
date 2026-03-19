import { getCurrentLanguage } from "@/frontend/i18n";

/**
 * Bengali digit map — converts ASCII 0-9 to Bengali numerals.
 */
const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBengaliDigits(str: string): string {
  return str.replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d)]);
}

/**
 * Format a number with locale awareness.
 * In Bangla mode, uses Bengali digits.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  const lang = getCurrentLanguage();
  const locale = lang === "bn" ? "bn-BD" : "en-BD";
  const formatted = new Intl.NumberFormat(locale, options).format(value);
  return lang === "bn" ? toBengaliDigits(formatted) : formatted;
}

/**
 * Format currency in BDT.
 * Examples:
 *   en: ৳ 1,200
 *   bn: ৳ ১,২০০
 */
export function formatCurrency(amount: number): string {
  const lang = getCurrentLanguage();
  const formatted = new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return lang === "bn" ? toBengaliDigits(formatted) : formatted;
}

/**
 * Format a date with locale awareness.
 * Supports preset formats:
 *   - "short":    Mar 16 / ১৬ মার্চ
 *   - "medium":   Mar 16, 2026 / ১৬ মার্চ, ২০২৬
 *   - "long":     March 16, 2026 / ১৬ মার্চ ২০২৬
 *   - "time":     9:00 AM / ৯:০০ AM
 *   - "datetime": Mar 16, 9:00 AM
 */
export function formatDate(
  date: Date | string | number,
  format: "short" | "medium" | "long" | "time" | "datetime" = "medium"
): string {
  const lang = getCurrentLanguage();
  const locale = lang === "bn" ? "bn-BD" : "en-BD";
  const d = new Date(date);

  let options: Intl.DateTimeFormatOptions;
  switch (format) {
    case "short":
      options = { month: "short", day: "numeric" };
      break;
    case "medium":
      options = { month: "short", day: "numeric", year: "numeric" };
      break;
    case "long":
      options = { month: "long", day: "numeric", year: "numeric" };
      break;
    case "time":
      options = { hour: "numeric", minute: "2-digit", hour12: true };
      break;
    case "datetime":
      options = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      break;
  }

  const formatted = new Intl.DateTimeFormat(locale, options).format(d);
  return lang === "bn" ? toBengaliDigits(formatted) : formatted;
}

/**
 * Format a phone number for display.
 * Input: "01712345678" → "+880 1712-345678"
 * In Bangla mode: "+৮৮০ ১৭১২-৩৪৫৬৭৮"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  let formatted: string;

  if (digits.startsWith("880")) {
    const local = digits.slice(3);
    formatted = `+880 ${local.slice(0, 4)}-${local.slice(4)}`;
  } else if (digits.startsWith("0")) {
    formatted = `+880 ${digits.slice(1, 5)}-${digits.slice(5)}`;
  } else {
    formatted = phone;
  }

  return getCurrentLanguage() === "bn" ? toBengaliDigits(formatted) : formatted;
}

/**
 * Convert a number to its Bengali text equivalent (for small counts).
 */
export function toBengaliCount(n: number): string {
  if (getCurrentLanguage() !== "bn") return String(n);
  return toBengaliDigits(String(n));
}
