import "server-only";

/**
 * Payment processing seam. No real processor is wired up yet — this
 * simulates an instant successful payment (e.g. cash on delivery) so the
 * rest of the order flow can be built and tested end to end. Swapping in a
 * real processor (e.g. Stripe Checkout) means implementing this function
 * for real and adding its webhook route — nothing else in the order flow
 * needs to change.
 */
export async function capturePayment(_orderId: string): Promise<{ paid: boolean }> {
  return { paid: true };
}
