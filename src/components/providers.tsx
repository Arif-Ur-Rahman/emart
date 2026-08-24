"use client";

import { LanguageProvider } from "@/i18n/language-context";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import type { CartItem } from "@/lib/types";

export function Providers({
  children,
  initialCartItems,
}: {
  children: React.ReactNode;
  initialCartItems: CartItem[];
}) {
  return (
    <LanguageProvider>
      <CartProvider initialItems={initialCartItems}>
        {children}
        <CartDrawer />
      </CartProvider>
    </LanguageProvider>
  );
}
