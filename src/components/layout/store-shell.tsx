import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllCategories } from "@/lib/data/categories";
import { getCart } from "@/lib/data/cart";
import { auth } from "@/lib/auth";

/** Storefront chrome: providers, header, footer. Shared by the store layout and the 404 page. */
export async function StoreShell({ children }: { children: React.ReactNode }) {
  const [categories, session, cartItems] = await Promise.all([
    getAllCategories(),
    auth(),
    getCart(),
  ]);

  return (
    <Providers initialCartItems={cartItems}>
      <AnnouncementBar />
      <Header categories={categories} user={session?.user ?? null} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </Providers>
  );
}
