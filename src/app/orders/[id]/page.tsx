import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getOrderById } from "@/lib/data/orders";
import { OrderReceipt } from "@/components/orders/order-receipt";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await verifySession();

  const order = await getOrderById(id, userId);
  if (!order) notFound();

  return <OrderReceipt order={order} />;
}
