/**
 * Everything in the shop is priced in Bangladeshi Taka. Prices are whole
 * numbers, so we never render decimals.
 */
const bdt = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

export function formatTaka(amount: number): string {
  return bdt.format(amount);
}

/** "৳ 450" without the grouping, for tight spots like badges. */
export function formatTakaCompact(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-US")}`;
}

export function discountPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Free delivery inside Bangladesh once the basket clears this amount. */
export const FREE_SHIPPING_THRESHOLD = 1000;
export const SHIPPING_FLAT_RATE = 60;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}
