import type { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { ORDER_STATUS_LABEL } from "@/lib/admin-format";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-sky-100 text-sky-900",
  SHIPPED: "bg-violet-100 text-violet-900",
  DELIVERED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-muted text-muted-foreground",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        STATUS_CLASSES[status]
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        status === "PAID" ? "bg-emerald-100 text-emerald-900" : "border text-muted-foreground"
      )}
    >
      {status === "PAID" ? "COD · Collected" : "COD · Unpaid"}
    </span>
  );
}
