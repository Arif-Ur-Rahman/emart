import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { CartProvider } from "@/components/cart/cart-provider";
import { CartSheet } from "@/components/cart/cart-sheet";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maloti.shop"),
  title: {
    default: "Maloti — Handmade ornaments & women's crafts",
    template: "%s · Maloti",
  },
  description:
    "Handmade bangles, hair bands, earrings and women's crafts from Bangladesh. Everything between ৳100 and ৳1,500, with free delivery over ৳1,000.",
  keywords: [
    "Maloti",
    "ornaments",
    "handmade jewellery Bangladesh",
    "bangles",
    "hair bands",
    "women's crafts",
  ],
  openGraph: {
    title: "Maloti — Handmade ornaments & women's crafts",
    description:
      "Handmade bangles, hair bands, earrings and women's crafts from Bangladesh, from ৳100 to ৳1,500.",
    type: "website",
    locale: "en_BD",
    siteName: "Maloti",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans antialiased", inter.variable, cormorant.variable)}
    >
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartSheet />
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
