import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Fraunces,
  Geist_Mono,
  Noto_Sans_Bengali,
  Noto_Serif_Bengali,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const heading = Fraunces({
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangla = Noto_Sans_Bengali({
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
});

const headingBangla = Noto_Serif_Bengali({
  variable: "--font-heading-bn",
  weight: ["500", "600", "700"],
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "emart — Everyday Fashion",
  description:
    "Coats, shirts, t-shirts and jeans delivered to your door — everyday fashion built for comfort and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${heading.variable} ${mono.variable} ${bangla.variable} ${headingBangla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
