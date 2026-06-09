"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatNumber } from "@/lib/format";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const { items, count, isOpen, setOpen } = useCart();
  const { t, lang } = useLanguage();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {t("cart.title")}
            {count > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({formatNumber(count, lang)} {count === 1 ? t("cart.item") : t("cart.items")})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">{t("cart.empty")}</p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className={buttonVariants()}
            >
              {t("cart.empty.cta")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y overflow-y-auto px-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.key}
                  item={item}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
            <SheetFooter className="border-t">
              <div className="w-full space-y-3">
                <CartSummary />
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  {t("cart.viewCart")}
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
