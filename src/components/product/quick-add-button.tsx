"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

/** The small round add button that sits on a product card. */
export function QuickAddButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (product.stock === 0) return null;

  return (
    <Button
      size="icon"
      variant="secondary"
      aria-label={`Add ${product.name} to bag`}
      className="size-9 rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
      onClick={(event) => {
        // The card is wrapped in a link — keep the click here.
        event.preventDefault();
        event.stopPropagation();
        add(product);
        toast.success(`${product.name} added to your bag`);
        setJustAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setJustAdded(false), 1600);
      }}
    >
      {justAdded ? <Check className="size-4" /> : <Plus className="size-4" />}
    </Button>
  );
}
