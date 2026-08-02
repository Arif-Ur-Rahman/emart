"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { ProductMotif } from "@/components/product/product-motif";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FREE_SHIPPING_THRESHOLD,
  formatTaka,
  SHIPPING_FLAT_RATE,
} from "@/lib/currency";

export function CartView() {
  const {
    items,
    hydrated,
    itemCount,
    subtotal,
    shipping,
    total,
    setQuantity,
    remove,
    clear,
  } = useCart();

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-muted">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-heading text-2xl font-semibold">
            Your bag is empty
          </h2>
          <p className="text-sm text-muted-foreground">
            Start with the bangles. Everyone does.
          </p>
        </div>
        <Button asChild size="lg" className="h-11 px-7">
          <Link href="/shop">
            Shop the collection
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <div>
        <div className="flex items-center justify-between border-b pb-4">
          <p className="text-sm text-muted-foreground tabular-nums">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              toast("Bag emptied");
            }}
          >
            Empty bag
          </Button>
        </div>

        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-6 sm:gap-6">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-muted sm:size-32"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <ProductMotif seed={item.slug} />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {formatTaka(item.price)} each
                    </p>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => {
                      remove(item.productId);
                      toast(`${item.name} removed`);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-md border">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-9 text-center text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Increase quantity"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>

                  <span className="font-heading text-lg font-semibold lining-nums tabular-nums">
                    {formatTaka(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="space-y-4 rounded-xl border bg-card p-6">
          <h2 className="font-heading text-xl font-semibold">Order summary</h2>

          <dl className="space-y-2.5 text-sm">
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
            <Separator />
            <div className="flex justify-between text-base font-medium">
              <dt>Total</dt>
              <dd className="font-heading text-xl lining-nums tabular-nums">
                {formatTaka(total)}
              </dd>
            </div>
          </dl>

          {remainingForFreeShipping > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary p-3">
              <p className="text-xs text-secondary-foreground">
                Add {formatTaka(remainingForFreeShipping)} more for free
                delivery.
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="h-11 w-full"
            onClick={() =>
              toast("Checkout opens when the order API goes live", {
                description: "Your bag is saved on this device until then.",
              })
            }
          >
            Proceed to checkout
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Cash on delivery · bKash · Nagad
            <br />
            Delivery {formatTaka(SHIPPING_FLAT_RATE)} flat below{" "}
            {formatTaka(FREE_SHIPPING_THRESHOLD)}
          </p>
        </div>

        <Button asChild variant="ghost" className="mt-3 w-full">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </aside>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <div className="space-y-6">
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-6">
            <Skeleton className="size-32 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
