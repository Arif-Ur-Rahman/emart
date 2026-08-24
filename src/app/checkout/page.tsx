import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCart } from "@/lib/data/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  await verifySession();

  const items = await getCart();
  if (items.length === 0) redirect("/cart");

  return <CheckoutForm />;
}
