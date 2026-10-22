/**
 * Background gradients a category can use behind its photo. Tailwind only
 * generates classes it finds in source files, so categories pick from this
 * list rather than storing arbitrary class names.
 */
export const CATEGORY_GRADIENTS = [
  { value: "from-slate-100 to-slate-200", label: "Slate" },
  { value: "from-stone-100 to-stone-200", label: "Stone" },
  { value: "from-sky-50 to-blue-100", label: "Sky" },
  { value: "from-blue-50 to-indigo-100", label: "Indigo" },
  { value: "from-rose-50 to-pink-100", label: "Rose" },
  { value: "from-amber-50 to-orange-100", label: "Amber" },
  { value: "from-emerald-50 to-teal-100", label: "Emerald" },
  { value: "from-violet-50 to-purple-100", label: "Violet" },
] as const;

export const DEFAULT_CATEGORY_GRADIENT = CATEGORY_GRADIENTS[0].value;
