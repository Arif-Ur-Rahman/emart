import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the pieces in your Maloti bag before checking out.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold">Your bag</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
