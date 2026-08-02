import type { CartItem, Product } from "@/lib/types";

/**
 * The bag lives in localStorage, which makes it an external store rather than
 * React state — so it's exposed through `useSyncExternalStore`. That gives us
 * correct hydration (server renders an empty bag, the client swaps in the
 * stored one after hydrating) and cross-tab sync for free, with no effects.
 */

const STORAGE_KEY = "maloti.cart.v1";
const MAX_QUANTITY = 20;

/** Stable reference so the server snapshot never looks "changed". */
const EMPTY: CartItem[] = [];

type Listener = () => void;

let snapshot: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<Listener>();

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CartItem).productId === "string" &&
    typeof (value as CartItem).slug === "string" &&
    typeof (value as CartItem).price === "number" &&
    typeof (value as CartItem).quantity === "number"
  );
}

function read(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    // Guard against a stale schema written by an earlier version of the shop.
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(items: CartItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or storage blocked (private mode) — the bag still works
    // for this session, it just won't survive a reload.
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function commit(items: CartItem[]): void {
  snapshot = items;
  write(items);
  emit();
}

function onStorage(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  snapshot = read();
  emit();
}

export function subscribe(listener: Listener): () => void {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorage);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function getSnapshot(): CartItem[] {
  // Read once, then serve the cached array so the snapshot stays referentially
  // stable between renders.
  if (!loaded) {
    snapshot = read();
    loaded = true;
  }
  return snapshot;
}

export function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(quantity, stock || MAX_QUANTITY, MAX_QUANTITY));
}

export function addItem(product: Product, quantity = 1): void {
  const items = getSnapshot();
  const wanted = clampQuantity(quantity, product.stock);
  const existing = items.find((item) => item.productId === product.id);

  if (existing) {
    commit(
      items.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + wanted, MAX_QUANTITY),
            }
          : item,
      ),
    );
    return;
  }

  commit([
    ...items,
    {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: wanted,
    },
  ]);
}

export function setItemQuantity(productId: string, quantity: number): void {
  const items = getSnapshot();

  if (quantity <= 0) {
    commit(items.filter((item) => item.productId !== productId));
    return;
  }

  commit(
    items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
        : item,
    ),
  );
}

export function removeItem(productId: string): void {
  commit(getSnapshot().filter((item) => item.productId !== productId));
}

export function clearCart(): void {
  commit(EMPTY);
}
