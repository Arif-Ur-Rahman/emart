import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "coats",
    name: { en: "Coats & Jackets", bn: "কোট ও জ্যাকেট" },
    tagline: { en: "Sharp layers for cooler days", bn: "ঠান্ডার দিনের জন্য স্মার্ট লেয়ার" },
    emoji: "🧥",
    icon: "Shirt",
    gradient: "from-slate-100 to-slate-200",
    image: "/cloths/coats/black-coat.png",
  },
  {
    slug: "shirts",
    name: { en: "Shirts", bn: "শার্ট" },
    tagline: { en: "Crisp formal & casual shirts", bn: "ফরমাল ও ক্যাজুয়াল শার্ট" },
    emoji: "👔",
    icon: "Shirt",
    gradient: "from-sky-50 to-blue-100",
    image: "/cloths/shirts/formal-shairts.jpg",
  },
  {
    slug: "tshirts",
    name: { en: "T-Shirts", bn: "টি-শার্ট" },
    tagline: { en: "Everyday graphic & plain tees", bn: "নিত্যদিনের গ্রাফিক ও প্লেইন টি" },
    emoji: "👕",
    icon: "Shirt",
    gradient: "from-stone-100 to-stone-200",
    image: "/cloths/tshirts/tshirt-black.jpg",
  },
  {
    slug: "jeans",
    name: { en: "Jeans", bn: "জিন্স" },
    tagline: { en: "Classic denim, tailored fit", bn: "ক্লাসিক ডেনিম, নিখুঁত ফিট" },
    emoji: "👖",
    icon: "Layers",
    gradient: "from-blue-50 to-indigo-100",
    image: "/cloths/jeans/tuananh-blue-9yoXrG6Er_g-unsplash.jpg",
  },
];

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
