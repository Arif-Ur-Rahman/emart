export const FREE_SHIPPING_THRESHOLD = 1000;
export const SHIPPING_FEE = 60;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
}
