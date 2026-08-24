import { verifySession } from "@/lib/dal";
import { getOrdersForUser } from "@/lib/data/orders";
import { OrderHistory } from "@/components/orders/order-history";

export default async function AccountOrdersPage() {
  const { userId } = await verifySession();
  const orders = await getOrdersForUser(userId);

  return <OrderHistory orders={orders} />;
}
