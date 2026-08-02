"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const { itemCount, hydrated, setOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="relative"
      aria-label={
        itemCount > 0 ? `Open bag, ${itemCount} items` : "Open bag, empty"
      }
      onClick={() => setOpen(true)}
    >
      <ShoppingBag className="size-5" />
      {/* Rendered only after hydration so the server HTML and the first client
          paint agree — otherwise the count flashes in. */}
      {hydrated && itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-4.5 place-items-center rounded-full bg-primary px-1 text-[0.625rem] leading-4.5 font-medium text-primary-foreground tabular-nums">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
