import type { Product, WeightOption } from "./types";

/** Convenience helpers for building bilingual weight options. */
function weights(
  opts: { id: string; en: string; bn: string; price: number; originalPrice?: number }[]
): WeightOption[] {
  return opts.map((o) => ({
    id: o.id,
    label: { en: o.en, bn: o.bn },
    price: o.price,
    originalPrice: o.originalPrice,
  }));
}

export const products: Product[] = [
  // ---------------- Honey ----------------
  {
    id: "honey-sundarban",
    slug: "sundarban-natural-honey",
    name: { en: "Sundarban Natural Honey", bn: "সুন্দরবনের প্রাকৃতিক মধু" },
    shortDesc: {
      en: "Wild-harvested from the mangrove forest.",
      bn: "ম্যানগ্রোভ বন থেকে সংগৃহীত খাঁটি মধু।",
    },
    description: {
      en: "100% raw, unprocessed honey collected by traditional honey hunters of the Sundarban. No added sugar, no heating — just pure floral honey with a rich aroma.",
      bn: "সুন্দরবনের মৌয়ালদের সংগৃহীত ১০০% খাঁটি ও প্রক্রিয়াবিহীন মধু। কোনো চিনি বা তাপ ছাড়াই — সম্পূর্ণ প্রাকৃতিক সুগন্ধযুক্ত মধু।",
    },
    price: 850,
    originalPrice: 1000,
    categorySlug: "honey",
    rating: 4.8,
    reviewCount: 214,
    badges: ["bestseller", "organic"],
    featured: true,
    weightOptions: weights([
      { id: "500g", en: "500 g", bn: "৫০০ গ্রাম", price: 850, originalPrice: 1000 },
      { id: "1kg", en: "1 kg", bn: "১ কেজি", price: 1600, originalPrice: 1900 },
    ]),
  },
  {
    id: "honey-mustard",
    slug: "mustard-flower-honey",
    name: { en: "Mustard Flower Honey", bn: "সরিষা ফুলের মধু" },
    shortDesc: { en: "Light, smooth & mild.", bn: "হালকা ও মসৃণ স্বাদের মধু।" },
    description: {
      en: "Collected from mustard flower fields, this light golden honey crystallizes naturally and has a gentle, buttery sweetness.",
      bn: "সরিষা ক্ষেত থেকে সংগৃহীত হালকা সোনালি মধু, প্রাকৃতিকভাবে জমে যায় এবং মৃদু মিষ্টি স্বাদের।",
    },
    price: 650,
    originalPrice: 750,
    categorySlug: "honey",
    rating: 4.6,
    reviewCount: 98,
    badges: ["organic"],
    featured: true,
    weightOptions: weights([
      { id: "500g", en: "500 g", bn: "৫০০ গ্রাম", price: 650, originalPrice: 750 },
      { id: "1kg", en: "1 kg", bn: "১ কেজি", price: 1200, originalPrice: 1400 },
    ]),
  },
  {
    id: "honey-litchi",
    slug: "litchi-flower-honey",
    name: { en: "Litchi Flower Honey", bn: "লিচু ফুলের মধু" },
    shortDesc: { en: "Fragrant seasonal honey.", bn: "সুগন্ধি মৌসুমি মধু।" },
    description: {
      en: "A seasonal favourite with a distinct litchi-blossom fragrance and a clean, sweet finish.",
      bn: "লিচু ফুলের আলাদা সুগন্ধযুক্ত মৌসুমি মধু, মিষ্টি ও পরিচ্ছন্ন স্বাদ।",
    },
    price: 700,
    categorySlug: "honey",
    rating: 4.7,
    reviewCount: 76,
  },

  // ---------------- Ghee ----------------
  {
    id: "ghee-cow",
    slug: "pure-cow-ghee",
    name: { en: "Pure Cow Ghee", bn: "খাঁটি গরুর ঘি" },
    shortDesc: {
      en: "Hand-made from full-cream milk.",
      bn: "সম্পূর্ণ দুধের সর থেকে তৈরি।",
    },
    description: {
      en: "Traditionally made desi cow ghee, slow-cooked from pure cream. Rich aroma, golden grain and absolutely no preservatives.",
      bn: "ঐতিহ্যবাহী পদ্ধতিতে দেশি গরুর দুধের সর থেকে ধীরে রান্না করা ঘি। সুগন্ধি, সোনালি দানা এবং কোনো প্রিজারভেটিভ নেই।",
    },
    price: 1150,
    originalPrice: 1300,
    categorySlug: "ghee",
    rating: 4.9,
    reviewCount: 342,
    badges: ["bestseller", "organic"],
    featured: true,
    weightOptions: weights([
      { id: "500g", en: "500 g", bn: "৫০০ গ্রাম", price: 1150, originalPrice: 1300 },
      { id: "1kg", en: "1 kg", bn: "১ কেজি", price: 2200, originalPrice: 2500 },
    ]),
  },
  {
    id: "ghee-buffalo",
    slug: "buffalo-milk-ghee",
    name: { en: "Buffalo Milk Ghee", bn: "মহিষের দুধের ঘি" },
    shortDesc: { en: "Extra rich & creamy.", bn: "অতিরিক্ত ক্রিমি ও সমৃদ্ধ।" },
    description: {
      en: "Made from pure buffalo milk for a creamier texture and deeper flavour — perfect for festive cooking.",
      bn: "খাঁটি মহিষের দুধ থেকে তৈরি, ক্রিমি টেক্সচার ও গভীর স্বাদ — উৎসবের রান্নার জন্য আদর্শ।",
    },
    price: 1300,
    categorySlug: "ghee",
    rating: 4.7,
    reviewCount: 121,
  },

  // ---------------- Mustard Oil ----------------
  {
    id: "oil-mustard",
    slug: "cold-pressed-mustard-oil",
    name: { en: "Cold-Pressed Mustard Oil", bn: "ঘানি ভাঙা সরিষার তেল" },
    shortDesc: { en: "Wood-pressed, pungent & pure.", bn: "ঘানিতে ভাঙা খাঁটি ঝাঁঝালো তেল।" },
    description: {
      en: "Traditional ghani (wood-pressed) mustard oil with the natural pungency and aroma that comes only from cold pressing.",
      bn: "ঐতিহ্যবাহী কাঠের ঘানিতে ভাঙা সরিষার তেল, প্রাকৃতিক ঝাঁঝ ও সুগন্ধ সম্পন্ন।",
    },
    price: 420,
    originalPrice: 500,
    categorySlug: "mustard-oil",
    rating: 4.8,
    reviewCount: 287,
    badges: ["bestseller", "organic"],
    featured: true,
    weightOptions: weights([
      { id: "1l", en: "1 litre", bn: "১ লিটার", price: 420, originalPrice: 500 },
      { id: "2l", en: "2 litre", bn: "২ লিটার", price: 800, originalPrice: 950 },
      { id: "5l", en: "5 litre", bn: "৫ লিটার", price: 1950, originalPrice: 2300 },
    ]),
  },

  // ---------------- Dates ----------------
  {
    id: "dates-ajwa",
    slug: "ajwa-dates",
    name: { en: "Ajwa Dates", bn: "আজওয়া খেজুর" },
    shortDesc: { en: "Soft Madinah dates.", bn: "মদিনার নরম খেজুর।" },
    description: {
      en: "Premium soft Ajwa dates from Madinah — rich, mildly sweet and packed with nutrients.",
      bn: "মদিনার প্রিমিয়াম নরম আজওয়া খেজুর — সুস্বাদু, মৃদু মিষ্টি ও পুষ্টিকর।",
    },
    price: 980,
    originalPrice: 1150,
    categorySlug: "dates",
    rating: 4.9,
    reviewCount: 156,
    badges: ["bestseller"],
    featured: true,
    weightOptions: weights([
      { id: "500g", en: "500 g", bn: "৫০০ গ্রাম", price: 980, originalPrice: 1150 },
      { id: "1kg", en: "1 kg", bn: "১ কেজি", price: 1850, originalPrice: 2200 },
    ]),
  },
  {
    id: "dates-medjool",
    slug: "medjool-dates",
    name: { en: "Medjool Dates", bn: "মেডজুল খেজুর" },
    shortDesc: { en: "Large & caramel-sweet.", bn: "বড় ও ক্যারামেল মিষ্টি।" },
    description: {
      en: "Jumbo Medjool dates with a soft, fudgy texture and natural caramel sweetness.",
      bn: "বড় আকারের মেডজুল খেজুর, নরম টেক্সচার ও প্রাকৃতিক ক্যারামেল মিষ্টতা।",
    },
    price: 1100,
    categorySlug: "dates",
    rating: 4.8,
    reviewCount: 89,
    badges: ["new"],
  },
  {
    id: "dates-mariam",
    slug: "mariam-dates",
    name: { en: "Mariam Dates", bn: "মরিয়ম খেজুর" },
    shortDesc: { en: "Chewy & wholesome.", bn: "চিবানো ও পুষ্টিকর।" },
    description: {
      en: "Popular everyday Mariam dates — chewy, sweet and great with milk.",
      bn: "জনপ্রিয় মরিয়ম খেজুর — চিবানো, মিষ্টি এবং দুধের সাথে দারুণ।",
    },
    price: 720,
    categorySlug: "dates",
    rating: 4.6,
    reviewCount: 64,
  },

  // ---------------- Nuts & Seeds ----------------
  {
    id: "nuts-almond",
    slug: "premium-almonds",
    name: { en: "Premium Almonds", bn: "প্রিমিয়াম কাঠবাদাম" },
    shortDesc: { en: "Crunchy California almonds.", bn: "মুচমুচে ক্যালিফোর্নিয়া বাদাম।" },
    description: {
      en: "Whole California almonds — a crunchy, protein-rich snack loaded with healthy fats.",
      bn: "সম্পূর্ণ ক্যালিফোর্নিয়া কাঠবাদাম — মুচমুচে, প্রোটিন সমৃদ্ধ এবং স্বাস্থ্যকর।",
    },
    price: 760,
    originalPrice: 850,
    categorySlug: "nuts-seeds",
    rating: 4.7,
    reviewCount: 132,
    featured: true,
    weightOptions: weights([
      { id: "500g", en: "500 g", bn: "৫০০ গ্রাম", price: 760, originalPrice: 850 },
      { id: "1kg", en: "1 kg", bn: "১ কেজি", price: 1450, originalPrice: 1650 },
    ]),
  },
  {
    id: "nuts-cashew",
    slug: "roasted-cashew-nuts",
    name: { en: "Roasted Cashew Nuts", bn: "রোস্টেড কাজু বাদাম" },
    shortDesc: { en: "Lightly salted & roasted.", bn: "হালকা লবণে রোস্ট করা।" },
    description: {
      en: "Whole cashews roasted to a golden crunch with a touch of salt — perfect for snacking.",
      bn: "সোনালি করে রোস্ট করা কাজু বাদাম, সামান্য লবণসহ — স্ন্যাকসের জন্য আদর্শ।",
    },
    price: 890,
    categorySlug: "nuts-seeds",
    rating: 4.6,
    reviewCount: 77,
    badges: ["bestseller"],
  },
  {
    id: "seeds-mixed",
    slug: "mixed-super-seeds",
    name: { en: "Mixed Super Seeds", bn: "মিক্সড সুপার সিড" },
    shortDesc: { en: "Chia, flax, pumpkin & more.", bn: "চিয়া, তিসি, কুমড়া বীজ ইত্যাদি।" },
    description: {
      en: "A nutritious blend of chia, flax, sunflower and pumpkin seeds — great over yogurt or salads.",
      bn: "চিয়া, তিসি, সূর্যমুখী ও কুমড়ার বীজের পুষ্টিকর মিশ্রণ — দই বা সালাদে দারুণ।",
    },
    price: 540,
    categorySlug: "nuts-seeds",
    rating: 4.5,
    reviewCount: 53,
    badges: ["new", "organic"],
  },

  // ---------------- Spices ----------------
  {
    id: "spice-turmeric",
    slug: "organic-turmeric-powder",
    name: { en: "Organic Turmeric Powder", bn: "অর্গানিক হলুদ গুঁড়া" },
    shortDesc: { en: "Stone-ground, no additives.", bn: "পাথরে ভাঙা, ভেজালমুক্ত।" },
    description: {
      en: "Sun-dried turmeric stone-ground into a vivid, high-curcumin powder with no artificial colour.",
      bn: "রোদে শুকানো হলুদ পাথরে ভেঙে তৈরি উজ্জ্বল গুঁড়া, কোনো কৃত্রিম রং নেই।",
    },
    price: 220,
    originalPrice: 260,
    categorySlug: "spices",
    rating: 4.7,
    reviewCount: 118,
    badges: ["organic"],
    featured: true,
  },
  {
    id: "spice-chili",
    slug: "red-chili-powder",
    name: { en: "Red Chili Powder", bn: "মরিচ গুঁড়া" },
    shortDesc: { en: "Fiery & pure.", bn: "ঝাল ও খাঁটি।" },
    description: {
      en: "Pure red chili powder ground from sun-dried chilies — bold colour and heat with no fillers.",
      bn: "রোদে শুকানো মরিচ থেকে তৈরি খাঁটি মরিচ গুঁড়া — গাঢ় রং ও ঝাল, কোনো ভেজাল নেই।",
    },
    price: 260,
    categorySlug: "spices",
    rating: 4.6,
    reviewCount: 71,
  },
  {
    id: "spice-cumin",
    slug: "whole-cumin-seeds",
    name: { en: "Whole Cumin Seeds", bn: "আস্ত জিরা" },
    shortDesc: { en: "Aromatic & fresh.", bn: "সুগন্ধি ও তাজা।" },
    description: {
      en: "Hand-picked whole cumin seeds with a strong, earthy aroma — toast and grind for best flavour.",
      bn: "হাতে বাছাই করা আস্ত জিরা, কড়া সুগন্ধযুক্ত — ভেজে গুঁড়া করলে সেরা স্বাদ।",
    },
    price: 320,
    categorySlug: "spices",
    rating: 4.5,
    reviewCount: 44,
  },

  // ---------------- Tea ----------------
  {
    id: "tea-green",
    slug: "premium-green-tea",
    name: { en: "Premium Green Tea", bn: "প্রিমিয়াম গ্রিন টি" },
    shortDesc: { en: "Fresh garden leaves.", bn: "বাগানের তাজা পাতা।" },
    description: {
      en: "Whole-leaf green tea from high-altitude gardens — light, refreshing and rich in antioxidants.",
      bn: "উঁচু বাগানের সম্পূর্ণ পাতার গ্রিন টি — হালকা, সতেজ ও অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ।",
    },
    price: 380,
    originalPrice: 450,
    categorySlug: "tea",
    rating: 4.6,
    reviewCount: 92,
    badges: ["organic"],
    featured: true,
  },
  {
    id: "tea-masala",
    slug: "masala-chai-blend",
    name: { en: "Masala Chai Blend", bn: "মসলা চা ব্লেন্ড" },
    shortDesc: { en: "Spiced black tea.", bn: "মসলাযুক্ত কালো চা।" },
    description: {
      en: "Robust black tea blended with cardamom, cinnamon, ginger and clove for the perfect cup of masala chai.",
      bn: "এলাচ, দারুচিনি, আদা ও লবঙ্গ মিশ্রিত কড়া কালো চা — নিখুঁত মসলা চায়ের জন্য।",
    },
    price: 340,
    categorySlug: "tea",
    rating: 4.7,
    reviewCount: 68,
    badges: ["bestseller"],
  },

  // ---------------- Others ----------------
  {
    id: "other-mustard-paste",
    slug: "kalo-jira-black-seed",
    name: { en: "Black Seed (Kalo Jira)", bn: "কালোজিরা" },
    shortDesc: { en: "The seed of blessings.", bn: "সকল রোগের মহৌষধ।" },
    description: {
      en: "Whole black cumin (nigella) seeds — use in pickles, tempering, or grind for daily wellness.",
      bn: "আস্ত কালোজিরা — আচার, ফোড়ন বা গুঁড়া করে প্রতিদিনের স্বাস্থ্যের জন্য।",
    },
    price: 290,
    categorySlug: "others",
    rating: 4.6,
    reviewCount: 59,
    badges: ["organic"],
  },
  {
    id: "other-date-molasses",
    slug: "khejur-gur-date-molasses",
    name: { en: "Date Molasses (Khejur Gur)", bn: "খেজুরের গুড়" },
    shortDesc: { en: "Winter's golden treat.", bn: "শীতের খাঁটি নলেন গুড়।" },
    description: {
      en: "Authentic winter date-palm molasses (nolen gur) — naturally sweet with a smoky caramel note.",
      bn: "শীতের খাঁটি নলেন গুড় — প্রাকৃতিক মিষ্টি ও ধোঁয়াটে ক্যারামেল স্বাদ।",
    },
    price: 360,
    originalPrice: 420,
    categorySlug: "others",
    rating: 4.8,
    reviewCount: 103,
    badges: ["bestseller"],
    featured: true,
  },
];

// ---------------- Getters (the seam for a future backend) ----------------

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.en.toLowerCase().includes(q) ||
      p.name.bn.includes(query.trim()) ||
      p.shortDesc.en.toLowerCase().includes(q)
  );
}
