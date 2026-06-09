"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product, WeightOption } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

const STORAGE_KEY = "gb.cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: WeightOption, quantity?: number) => void;
  updateQty: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist after hydration so we don't overwrite stored data on first render.
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, variant?: WeightOption, quantity = 1) => {
      const key = lineKey(product.id, variant?.id);
      const category = getCategoryBySlug(product.categorySlug);
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
          emoji: product.emoji ?? category?.emoji ?? "🛍️",
          gradient: category?.gradient ?? "from-stone-100 to-stone-200",
          price: variant?.price ?? product.price,
          quantity,
        };
        return [...prev, newItem];
      });
      setOpen(true);
    },
    []
  );

  const updateQty = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

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
