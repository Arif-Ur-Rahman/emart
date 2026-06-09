import type { Locale } from "@/lib/types";

/** UI string keys shared across the app. */
export const dictionaries = {
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.contact": "Contact",

    "announce.text": "🚚 Free home delivery on orders over ৳1000 — Cash on delivery available!",

    "search.placeholder": "Search for honey, ghee, dates…",
    "search.empty": "No products found.",

    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty.",
    "cart.empty.cta": "Continue shopping",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.shipping.free": "Free",
    "cart.total": "Total",
    "cart.checkout": "Checkout (coming soon)",
    "cart.checkout.note": "Online checkout will be available once the backend is connected.",
    "cart.viewCart": "View cart",
    "cart.remove": "Remove",
    "cart.items": "items",
    "cart.item": "item",

    "product.addToCart": "Add to cart",
    "product.orderNow": "Order now",
    "product.added": "Added ✓",
    "product.outOf": "out of 5",
    "product.reviews": "reviews",
    "product.quantity": "Quantity",
    "product.weight": "Weight / Size",
    "product.description": "Description",
    "product.related": "You may also like",
    "product.save": "Save",

    "home.hero.title": "Pure & Organic Food,\nDelivered to Your Door",
    "home.hero.subtitle":
      "Authentic honey, ghee, mustard oil, dates and more — sourced directly, with no adulteration.",
    "home.hero.cta": "Shop now",
    "home.hero.cta2": "Explore categories",
    "home.categories.title": "Shop by Category",
    "home.featured.title": "Best Sellers",
    "home.featured.subtitle": "Loved by thousands of families",
    "home.new.title": "Fresh Arrivals",
    "home.viewAll": "View all",

    "feature.delivery.title": "Free Delivery",
    "feature.delivery.desc": "On orders over ৳1000",
    "feature.authentic.title": "100% Authentic",
    "feature.authentic.desc": "No adulteration, ever",
    "feature.cod.title": "Cash on Delivery",
    "feature.cod.desc": "Pay when you receive",

    "shop.title": "All Products",
    "shop.results": "products",
    "shop.filter.all": "All categories",
    "shop.sort.label": "Sort by",
    "shop.sort.featured": "Featured",
    "shop.sort.priceLow": "Price: low to high",
    "shop.sort.priceHigh": "Price: high to low",
    "shop.sort.rating": "Top rated",
    "shop.none": "No products match your filters.",

    "badge.bestseller": "Bestseller",
    "badge.new": "New",
    "badge.organic": "Organic",

    "footer.about.title": "Tiffani & Blue",
    "footer.about.desc":
      "Bringing exquisite fine and fashion jewellery from trusted craftspeople straight to your home.",
    "footer.shop": "Shop",
    "footer.help": "Help",
    "footer.help.faq": "FAQ",
    "footer.help.shipping": "Shipping & Returns",
    "footer.help.track": "Track Order",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.madeWith": "Demo storefront — backend coming soon.",

    "common.backHome": "Back to home",
    "common.notFound": "Page not found",
    "common.notFound.desc": "The page you’re looking for doesn’t exist.",
  },

  bn: {
    "nav.home": "হোম",
    "nav.shop": "শপ",
    "nav.categories": "ক্যাটাগরি",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.contact": "যোগাযোগ",

    "announce.text": "🚚 ১০০০৳ এর বেশি অর্ডারে ফ্রি হোম ডেলিভারি — ক্যাশ অন ডেলিভারি সুবিধা!",

    "search.placeholder": "মধু, ঘি, খেজুর খুঁজুন…",
    "search.empty": "কোনো পণ্য পাওয়া যায়নি।",

    "cart.title": "আপনার কার্ট",
    "cart.empty": "আপনার কার্ট খালি।",
    "cart.empty.cta": "কেনাকাটা চালিয়ে যান",
    "cart.subtotal": "সাবটোটাল",
    "cart.shipping": "ডেলিভারি চার্জ",
    "cart.shipping.free": "ফ্রি",
    "cart.total": "মোট",
    "cart.checkout": "চেকআউট (শীঘ্রই আসছে)",
    "cart.checkout.note": "ব্যাকএন্ড যুক্ত হলে অনলাইন চেকআউট চালু হবে।",
    "cart.viewCart": "কার্ট দেখুন",
    "cart.remove": "সরান",
    "cart.items": "টি পণ্য",
    "cart.item": "টি পণ্য",

    "product.addToCart": "কার্টে যোগ করুন",
    "product.orderNow": "অর্ডার করুন",
    "product.added": "যোগ হয়েছে ✓",
    "product.outOf": "এর মধ্যে ৫",
    "product.reviews": "রিভিউ",
    "product.quantity": "পরিমাণ",
    "product.weight": "ওজন / সাইজ",
    "product.description": "বিবরণ",
    "product.related": "এগুলোও পছন্দ হতে পারে",
    "product.save": "সাশ্রয়",

    "home.hero.title": "খাঁটি ও অর্গানিক খাবার,\nআপনার দরজায়",
    "home.hero.subtitle":
      "খাঁটি মধু, ঘি, সরিষার তেল, খেজুরসহ আরও অনেক কিছু — সরাসরি সংগৃহীত, ভেজালমুক্ত।",
    "home.hero.cta": "এখনই কিনুন",
    "home.hero.cta2": "ক্যাটাগরি দেখুন",
    "home.categories.title": "ক্যাটাগরি অনুযায়ী কিনুন",
    "home.featured.title": "বেস্ট সেলার",
    "home.featured.subtitle": "হাজারো পরিবারের পছন্দ",
    "home.new.title": "নতুন পণ্য",
    "home.viewAll": "সব দেখুন",

    "feature.delivery.title": "ফ্রি ডেলিভারি",
    "feature.delivery.desc": "১০০০৳ এর বেশি অর্ডারে",
    "feature.authentic.title": "১০০% খাঁটি",
    "feature.authentic.desc": "কোনো ভেজাল নেই",
    "feature.cod.title": "ক্যাশ অন ডেলিভারি",
    "feature.cod.desc": "পণ্য পেয়ে টাকা দিন",

    "shop.title": "সকল পণ্য",
    "shop.results": "টি পণ্য",
    "shop.filter.all": "সব ক্যাটাগরি",
    "shop.sort.label": "সাজান",
    "shop.sort.featured": "ফিচার্ড",
    "shop.sort.priceLow": "দাম: কম থেকে বেশি",
    "shop.sort.priceHigh": "দাম: বেশি থেকে কম",
    "shop.sort.rating": "সেরা রেটিং",
    "shop.none": "আপনার ফিল্টারে কোনো পণ্য নেই।",

    "badge.bestseller": "বেস্ট সেলার",
    "badge.new": "নতুন",
    "badge.organic": "অর্গানিক",

    "footer.about.title": "টিফানি অ্যান্ড ব্লু",
    "footer.about.desc": "বিশ্বস্ত কারিগরদের কাছ থেকে অসাধারণ ফাইন ও ফ্যাশন গয়না সরাসরি আপনার ঘরে পৌঁছে দিচ্ছি।",
    "footer.shop": "শপ",
    "footer.help": "সহায়তা",
    "footer.help.faq": "প্রশ্নোত্তর",
    "footer.help.shipping": "ডেলিভারি ও রিটার্ন",
    "footer.help.track": "অর্ডার ট্র্যাক",
    "footer.contact": "যোগাযোগ",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "footer.madeWith": "ডেমো স্টোরফ্রন্ট — ব্যাকএন্ড শীঘ্রই আসছে।",

    "common.backHome": "হোমে ফিরুন",
    "common.notFound": "পেজ পাওয়া যায়নি",
    "common.notFound.desc": "আপনি যে পেজটি খুঁজছেন সেটি নেই।",
  },
} as const;

export type TranslationKey = keyof (typeof dictionaries)["en"];

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}
