import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "honey",
    name: { en: "Honey", bn: "মধু" },
    tagline: { en: "Raw & unprocessed", bn: "খাঁটি ও প্রাকৃতিক" },
    emoji: "🍯",
    icon: "Droplet",
    gradient: "from-amber-50 to-amber-100",
  },
  {
    slug: "ghee",
    name: { en: "Ghee", bn: "ঘি" },
    tagline: { en: "Pure cow ghee", bn: "খাঁটি গরুর ঘি" },
    emoji: "🧈",
    icon: "CircleDot",
    gradient: "from-amber-50 to-yellow-100",
  },
  {
    slug: "mustard-oil",
    name: { en: "Mustard Oil", bn: "সরিষার তেল" },
    tagline: { en: "Cold-pressed", bn: "ঘানি ভাঙা" },
    emoji: "🫗",
    icon: "Flame",
    gradient: "from-lime-50 to-yellow-100",
  },
  {
    slug: "dates",
    name: { en: "Dates", bn: "খেজুর" },
    tagline: { en: "Premium imported", bn: "প্রিমিয়াম খেজুর" },
    emoji: "🌰",
    icon: "Nut",
    gradient: "from-orange-50 to-amber-100",
  },
  {
    slug: "nuts-seeds",
    name: { en: "Nuts & Seeds", bn: "বাদাম ও বীজ" },
    tagline: { en: "Crunchy & healthy", bn: "স্বাস্থ্যকর বাদাম" },
    emoji: "🥜",
    icon: "Bean",
    gradient: "from-amber-50 to-orange-100",
  },
  {
    slug: "spices",
    name: { en: "Spices", bn: "মসলা" },
    tagline: { en: "Aromatic & fresh", bn: "সুগন্ধি মসলা" },
    emoji: "🌶️",
    icon: "Sparkles",
    gradient: "from-rose-50 to-red-100",
  },
  {
    slug: "tea",
    name: { en: "Tea", bn: "চা" },
    tagline: { en: "Garden fresh", bn: "বাগানের তাজা চা" },
    emoji: "🍵",
    icon: "Leaf",
    gradient: "from-emerald-50 to-green-100",
  },
  {
    slug: "others",
    name: { en: "Others", bn: "অন্যান্য" },
    tagline: { en: "Daily essentials", bn: "নিত্য প্রয়োজনীয়" },
    emoji: "🛒",
    icon: "ShoppingBasket",
    gradient: "from-stone-100 to-stone-200",
  },
];

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
