"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { ProductMotif } from "@/components/product/product-motif";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FREE_SHIPPING_THRESHOLD, formatTaka } from "@/lib/currency";

export function CartSheet() {
  const { items, itemCount, subtotal, shipping, total, isOpen, setOpen } =
    useCart();

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="font-heading text-lg lining-nums">
            Your bag {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Nothing here yet."
              : remainingForFreeShipping > 0
                ? `Add ${formatTaka(remainingForFreeShipping)} more for free delivery.`
                : "You've unlocked free delivery."}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your bag is empty. The bangles are lonely.
            </p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-6">
              {items.map((item) => (
                <CartRow key={item.productId} productId={item.productId} />
              ))}
            </ul>

            <SheetFooter className="gap-3 border-t px-6">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatTaka(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Free" : formatTaka(shipping)}
                  </dd>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-medium">
                  <dt>Total</dt>
                  <dd className="font-heading text-base lining-nums tabular-nums">
                    {formatTaka(total)}
                  </dd>
                </div>
              </dl>

              <Button asChild size="lg" className="h-11 w-full">
                <Link href="/cart" onClick={() => setOpen(false)}>
                  View bag &amp; checkout
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartRow({ productId }: { productId: string }) {
  const { items, setQuantity, remove } = useCart();
  const item = items.find((candidate) => candidate.productId === productId);
  if (!item) return null;

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <ProductMotif seed={item.slug} />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            className="text-sm leading-snug font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`Remove ${item.name}`}
            onClick={() => remove(item.productId)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground tabular-nums">
          {formatTaka(item.price)} each
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center rounded-md border">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Increase quantity"
              onClick={() => setQuantity(item.productId, item.quantity + 1)}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <span className="text-sm font-medium tabular-nums">
            {formatTaka(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}
