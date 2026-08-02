"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  addItem,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeItem,
  setItemQuantity,
  subscribe,
} from "@/lib/cart-store";
import { shippingFor } from "@/lib/currency";
import type { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  /** False during SSR and the hydration pass, true once the stored bag is live. */
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const noopSubscribe = () => () => {};

/** True only after hydration, so counts don't mismatch the server HTML. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();
  const [isOpen, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = shippingFor(subtotal);

    return {
      items,
      hydrated,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      isOpen,
      setOpen,
      add: addItem,
      setQuantity: setItemQuantity,
      remove: removeItem,
      clear: clearCart,
    };
  }, [items, hydrated, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
