import type { Locale } from "./types";

const enDigits = "0123456789";
const bnDigits = "০১২৩৪৫৬৭৮৯";

/** Convert ASCII digits in a string to Bangla digits. */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => bnDigits[enDigits.indexOf(d)]);
}

/** Format a BDT price like ৳1,250 (or ৳১,২৫০ in Bangla). */
export function formatPrice(amount: number, locale: Locale = "en"): string {
  const grouped = new Intl.NumberFormat("en-US").format(Math.round(amount));
  const digits = locale === "bn" ? toBanglaDigits(grouped) : grouped;
  return `৳${digits}`;
}

/** Localize a plain number (e.g. ratings, counts). */
export function formatNumber(value: number, locale: Locale = "en"): string {
  return locale === "bn" ? toBanglaDigits(value) : String(value);
}

/** Percentage saved between an original and current price. */
export function discountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
