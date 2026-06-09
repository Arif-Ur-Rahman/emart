"use client";

import { LanguageProvider } from "@/i18n/language-context";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </LanguageProvider>
  );
}
