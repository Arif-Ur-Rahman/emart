"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@/generated/prisma/enums";
import { ORDER_TRANSITIONS } from "@/lib/order-status";
import { formatTaka } from "@/lib/admin-format";
import { updateOrderStatus } from "@/lib/actions/admin/orders";
import { Button } from "@/components/ui/button";

const NEXT_STEP_LABEL: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Confirm order",
  SHIPPED: "Mark as shipped",
  DELIVERED: "Mark delivered · cash collected",
};

const CANCEL_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING: "Cancel order",
  CONFIRMED: "Cancel order",
  SHIPPED: "Cancel · returned / refused",
};

export function OrderActions({
  orderId,
  status,
  total,
}: {
  orderId: string;
  status: OrderStatus;
  total: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [pending, startTransition] = useTransition();

  const next = ORDER_TRANSITIONS[status].filter((s) => s !== "CANCELLED");
  const canCancel = ORDER_TRANSITIONS[status].includes("CANCELLED");

  function move(to: OrderStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, to);
      if (!result.ok) setError(result.error);
      setConfirmingCancel(false);
    });
  }

  if (next.length === 0 && !canCancel) {
    return (
      <p className="text-sm text-muted-foreground">
        {status === "DELIVERED"
          ? `Delivered and ${formatTaka(total)} collected. No further steps.`
          : "This order is cancelled and its stock was returned."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {next.map((to) => (
          <Button key={to} disabled={pending} onClick={() => move(to)}>
            {NEXT_STEP_LABEL[to]}
          </Button>
        ))}
        {canCancel &&
          (confirmingCancel ? (
            <>
              <Button variant="destructive" disabled={pending} onClick={() => move("CANCELLED")}>
                Yes, cancel and restock
              </Button>
              <Button variant="ghost" disabled={pending} onClick={() => setConfirmingCancel(false)}>
                Keep order
              </Button>
            </>
          ) : (
            <Button variant="outline" disabled={pending} onClick={() => setConfirmingCancel(true)}>
              {CANCEL_LABEL[status]}
            </Button>
          ))}
      </div>
      {status === "SHIPPED" && (
        <p className="text-xs text-muted-foreground">
          Courier should collect {formatTaka(total)} in cash.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
