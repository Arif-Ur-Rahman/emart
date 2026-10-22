import type { Product, SizeOption } from "../../src/lib/types";

// Stock is assigned by the seed script, so catalog entries here omit it.
type SeedSizeOption = Omit<SizeOption, "stock">;
export type SeedProduct = Omit<Product, "stock" | "sizeOptions"> & {
  sizeOptions?: SeedSizeOption[];
};

/** Convenience helper for building bilingual size options. */
function sizes(
  opts: { id: string; en: string; bn: string; price: number; originalPrice?: number }[]
): SeedSizeOption[] {
  return opts.map((o) => ({
    id: o.id,
    label: { en: o.en, bn: o.bn },
    price: o.price,
    originalPrice: o.originalPrice,
  }));
}

function apparelSizes(price: number, originalPrice?: number): SeedSizeOption[] {
  return sizes([
    { id: "s", en: "S", bn: "এস", price, originalPrice },
    { id: "m", en: "M", bn: "এম", price, originalPrice },
    { id: "l", en: "L", bn: "এল", price, originalPrice },
    { id: "xl", en: "XL", bn: "এক্সএল", price, originalPrice },
  ]);
}

function jeansSizes(price: number, originalPrice?: number): SeedSizeOption[] {
  return sizes([
    { id: "w30", en: "30", bn: "৩০", price, originalPrice },
    { id: "w32", en: "32", bn: "৩২", price, originalPrice },
    { id: "w34", en: "34", bn: "৩৪", price, originalPrice },
    { id: "w36", en: "36", bn: "৩৬", price, originalPrice },
  ]);
}

export const products: SeedProduct[] = [
  // ---------------- Coats ----------------
  {
    id: "coat-black-classic",
    slug: "classic-black-coat",
    name: { en: "Classic Black Overcoat", bn: "ক্লাসিক কালো কোট" },
    shortDesc: {
      en: "Tailored black coat for a sharp look.",
      bn: "স্মার্ট লুকের জন্য টেইলর্ড কালো কোট।",
    },
    description: {
      en: "A tailored black overcoat with clean lines and a modern slim fit. Layer it over a shirt for the office or wear it open for evenings out.",
      bn: "পরিচ্ছন্ন কাটিং ও আধুনিক স্লিম ফিটের টেইলর্ড কালো কোট। অফিসের জন্য শার্টের ওপর অথবা সন্ধ্যায় খোলা রেখে পরুন।",
    },
    price: 4500,
    originalPrice: 5200,
    categorySlug: "coats",
    image: "/cloths/coats/black-coat.png",
    rating: 4.7,
    reviewCount: 58,
    badges: ["bestseller"],
    featured: true,
    sizeOptions: apparelSizes(4500, 5200),
  },

  // ---------------- Shirts ----------------
  {
    id: "shirt-formal-classic",
    slug: "classic-formal-shirt",
    name: { en: "Classic Formal Shirt", bn: "ক্লাসিক ফরমাল শার্ট" },
    shortDesc: {
      en: "Crisp cotton shirt for office & events.",
      bn: "অফিস ও অনুষ্ঠানের জন্য পরিপাটি সুতির শার্ট।",
    },
    description: {
      en: "A crisp, breathable cotton shirt with a clean point collar — built for long office days and dressy evenings alike.",
      bn: "পরিপাটি ও আরামদায়ক সুতির শার্ট, পরিষ্কার কলার ডিজাইন — অফিসের দীর্ঘ দিন এবং অনুষ্ঠানের জন্য উপযুক্ত।",
    },
    price: 1200,
    originalPrice: 1450,
    categorySlug: "shirts",
    image: "/cloths/shirts/formal-shairts.jpg",
    rating: 4.5,
    reviewCount: 34,
    badges: ["new"],
    featured: true,
    sizeOptions: apparelSizes(1200, 1450),
  },

  // ---------------- T-Shirts ----------------
  {
    id: "tshirt-black-print",
    slug: "black-graphic-tee",
    name: { en: "Black Graphic Tee", bn: "কালো গ্রাফিক টি-শার্ট" },
    shortDesc: {
      en: "Soft cotton tee with a bold front print.",
      bn: "সাহসী প্রিন্টসহ নরম সুতির টি-শার্ট।",
    },
    description: {
      en: "A soft, breathable cotton t-shirt with a bold statement print across the chest — an easy everyday layer that pairs with anything.",
      bn: "নরম ও আরামদায়ক সুতির টি-শার্ট, বুকজুড়ে সাহসী প্রিন্ট — যেকোনো কিছুর সাথে মানানসই নিত্যদিনের পোশাক।",
    },
    price: 550,
    categorySlug: "tshirts",
    image: "/cloths/tshirts/tshirt-black.jpg",
    rating: 4.6,
    reviewCount: 89,
    badges: ["bestseller"],
    featured: true,
    sizeOptions: apparelSizes(550),
  },
  {
    id: "tshirt-black-badge",
    slug: "705-badge-tee",
    name: { en: "705 Badge Tee", bn: "৭০৫ ব্যাজ টি-শার্ট" },
    shortDesc: {
      en: "Minimal black tee with a chest badge logo.",
      bn: "বুকে ব্যাজ লোগোসহ মিনিমাল কালো টি-শার্ট।",
    },
    description: {
      en: "A minimal black tee finished with a small circular badge logo on the chest — heavyweight cotton that holds its shape wash after wash.",
      bn: "বুকে ছোট গোলাকার ব্যাজ লোগোসহ মিনিমাল কালো টি-শার্ট — ভারী সুতি কাপড়, বারবার ধোয়ার পরও আকৃতি ঠিক থাকে।",
    },
    price: 520,
    categorySlug: "tshirts",
    image: "/cloths/tshirts/tshirt-black2.jpg",
    rating: 4.4,
    reviewCount: 41,
    badges: ["new"],
    sizeOptions: apparelSizes(520),
  },

  // ---------------- Jeans ----------------
  {
    id: "jeans-classic-blue",
    slug: "classic-blue-jeans",
    name: { en: "Classic Blue Jeans", bn: "ক্লাসিক ব্লু জিন্স" },
    shortDesc: {
      en: "Timeless straight-fit denim.",
      bn: "চিরায়ত স্ট্রেইট ফিট ডেনিম।",
    },
    description: {
      en: "Timeless straight-fit denim in a mid-wash blue, cut from sturdy cotton twill with just enough stretch for all-day comfort.",
      bn: "মিড-ওয়াশ নীল রঙের চিরায়ত স্ট্রেইট ফিট ডেনিম, টেকসই সুতি টুইল কাপড়ে তৈরি, সারাদিনের আরামের জন্য পর্যাপ্ত স্ট্রেচসহ।",
    },
    price: 1800,
    originalPrice: 2100,
    categorySlug: "jeans",
    image: "/cloths/jeans/tuananh-blue-9yoXrG6Er_g-unsplash.jpg",
    rating: 4.8,
    reviewCount: 120,
    badges: ["bestseller"],
    featured: true,
    sizeOptions: jeansSizes(1800, 2100),
  },
  {
    id: "jeans-slim-blue",
    slug: "slim-fit-blue-jeans",
    name: { en: "Slim Fit Blue Jeans", bn: "স্লিম ফিট ব্লু জিন্স" },
    shortDesc: {
      en: "Modern slim-fit stretch denim.",
      bn: "আধুনিক স্লিম ফিট স্ট্রেচ ডেনিম।",
    },
    description: {
      en: "A modern slim-fit jean with a touch of stretch for movement — tapered through the leg with a clean, versatile wash.",
      bn: "আধুনিক স্লিম ফিট জিন্স, সামান্য স্ট্রেচসহ — পায়ের দিকে টেপার্ড কাট এবং পরিষ্কার, সবকিছুর সাথে মানানসই ওয়াশ।",
    },
    price: 1950,
    categorySlug: "jeans",
    image: "/cloths/jeans/tuananh-blue-UinXCaBz44A-unsplash.jpg",
    rating: 4.6,
    reviewCount: 76,
    badges: ["new"],
    sizeOptions: jeansSizes(1950),
  },
];
