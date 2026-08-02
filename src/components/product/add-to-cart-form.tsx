"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

const MAX_PER_ORDER = 20;

/** Quantity stepper plus the primary add action on a product page. */
export function AddToCartForm({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  const ceiling = Math.min(product.stock || MAX_PER_ORDER, MAX_PER_ORDER);
  const soldOut = product.stock === 0;

  if (soldOut) {
    return (
      <Button size="lg" disabled className="w-full sm:w-auto">
        Sold out
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-11 w-fit items-center rounded-md border">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-11 rounded-r-none"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        >
          <Minus className="size-4" />
        </Button>
        <span
          aria-live="polite"
          className="w-10 text-center text-sm font-medium tabular-nums"
        >
          {quantity}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-11 rounded-l-none"
          aria-label="Increase quantity"
          disabled={quantity >= ceiling}
          onClick={() => setQuantity((current) => Math.min(ceiling, current + 1))}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <Button
        size="lg"
        className="h-11 flex-1 sm:flex-none sm:px-10"
        onClick={() => {
          add(product, quantity);
          toast.success(
            quantity === 1
              ? `${product.name} added to your bag`
              : `${quantity} × ${product.name} added to your bag`,
          );
          setQuantity(1);
          setOpen(true);
        }}
      >
        <ShoppingBag className="size-4" />
        Add to bag
      </Button>
    </div>
  );
}
