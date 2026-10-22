"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product, SizeOption } from "@/lib/types";
import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItemQty,
} from "@/lib/actions/cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: SizeOption, quantity?: number) => void;
  updateQty: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export function CartProvider({
  children,
  initialItems,
}: {
  children: React.ReactNode;
  initialItems: CartItem[];
}) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [isOpen, setOpen] = useState(false);

  // When the server re-renders the layout (e.g. after placing an order empties
  // the cart), adopt its cart as the new source of truth.
  const [serverItems, setServerItems] = useState(initialItems);
  if (initialItems !== serverItems) {
    setServerItems(initialItems);
    setItems(initialItems);
  }

  // Persisted server-side (see src/lib/actions/cart.ts); local state below
  // is an optimistic mirror so the UI updates instantly.
  const addItem = useCallback(
    (product: Product, variant?: SizeOption, quantity = 1) => {
      const key = lineKey(product.id, variant?.id);
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        const newItem: CartItem = {
          key,
          productId: product.id,
          slug: product.slug,
          variantId: variant?.id,
          name: product.name,
          variantLabel: variant?.label,
          image: product.image,
          price: variant?.price ?? product.price,
          quantity,
        };
        return [...prev, newItem];
      });
      setOpen(true);
      startTransition(() => {
        addCartItem(product.id, variant?.id, quantity);
      });
    },
    []
  );

  const updateQty = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
    startTransition(() => {
      updateCartItemQty(key, quantity);
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    startTransition(() => {
      removeCartItem(key);
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    startTransition(() => {
      clearCart();
    });
  }, []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    setOpen,
    addItem,
    updateQty,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
