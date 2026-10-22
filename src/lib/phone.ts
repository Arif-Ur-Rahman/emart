const bnDigits = "০১২৩৪৫৬৭৮৯";

/**
 * Normalizes a Bangladeshi mobile number to the 11-digit local form
 * (01XXXXXXXXX). Accepts Bangla digits, spaces/dashes and a +88/88 prefix.
 */
export function normalizeBdPhone(input: string): string {
  const ascii = input.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
  const digits = ascii.replace(/[\s\-().]/g, "").replace(/^\+?88(?=01)/, "");
  return digits;
}

/** Operator prefixes 013–019 followed by 8 digits. */
export const BD_MOBILE_RE = /^01[3-9]\d{8}$/;
