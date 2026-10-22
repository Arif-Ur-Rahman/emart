"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { saveProduct, deleteProduct } from "@/lib/actions/admin/products";
import type { FormState } from "@/lib/actions/admin/form-state";
import { useFormAction } from "./use-form-action";
import { Field, selectClassName } from "./field";
import { ConfirmButton } from "./confirm-button";
import { ProductImage } from "@/components/product/product-image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ProductFormValues = {
  id?: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  shortDescEn: string;
  shortDescBn: string;
  descriptionEn: string;
  descriptionBn: string;
  categoryId: string;
  image: string;
  badges: string[];
  featured: boolean;
  active: boolean;
  price: string;
  originalPrice: string;
  stock: string;
  sizes: SizeRow[];
};

type SizeRow = {
  /** Existing SizeOption id; absent for rows added in this form. */
  id?: string;
  sizeId: string;
  labelEn: string;
  labelBn: string;
  price: string;
  originalPrice: string;
  stock: string;
};

const SIZE_PRESETS: { name: string; sizes: [string, string, string][] }[] = [
  {
    name: "S – XL",
    sizes: [
      ["s", "S", "এস"],
      ["m", "M", "এম"],
      ["l", "L", "এল"],
      ["xl", "XL", "এক্সএল"],
    ],
  },
  {
    name: "Waist 30 – 36",
    sizes: [
      ["w30", "30", "৩০"],
      ["w32", "32", "৩২"],
      ["w34", "34", "৩৪"],
      ["w36", "36", "৩৬"],
    ],
  },
];

const BADGE_OPTIONS = [
  { value: "bestseller", label: "Bestseller" },
  { value: "new", label: "New" },
  { value: "organic", label: "Organic" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({
  initial,
  categories,
  orderCount,
}: {
  initial: ProductFormValues;
  categories: { id: string; name: string }[];
  /** Past order lines for this product; deleting is blocked when > 0. */
  orderCount: number;
}) {
  const [state, onSubmit, pending] = useFormAction<FormState>(saveProduct, undefined);
  const errors = state?.errors ?? {};

  const isNew = !initial.id;
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [image, setImage] = useState(initial.image);
  const [hasSizes, setHasSizes] = useState(initial.sizes.length > 0 || isNew);
  const [sizes, setSizes] = useState<SizeRow[]>(initial.sizes);
  const [basePrice, setBasePrice] = useState(initial.price);

  function updateSize(index: number, patch: Partial<SizeRow>) {
    setSizes((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function moveSize(index: number, delta: number) {
    setSizes((rows) => {
      const next = [...rows];
      const [row] = next.splice(index, 1);
      next.splice(index + delta, 0, row);
      return next;
    });
  }

  function addPreset(preset: (typeof SIZE_PRESETS)[number]) {
    setSizes((rows) => {
      const existing = new Set(rows.map((r) => r.sizeId));
      const price = rows[0]?.price ?? basePrice;
      const originalPrice = rows[0]?.originalPrice ?? "";
      return [
        ...rows,
        ...preset.sizes
          .filter(([sizeId]) => !existing.has(sizeId))
          .map(([sizeId, labelEn, labelBn]) => ({
            sizeId,
            labelEn,
            labelBn,
            price,
            originalPrice,
            stock: "0",
          })),
      ];
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name (English)" htmlFor="nameEn" error={errors.nameEn}>
                <Input
                  id="nameEn"
                  name="nameEn"
                  defaultValue={initial.nameEn}
                  onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
                  required
                />
              </Field>
              <Field label="Name (বাংলা)" htmlFor="nameBn" error={errors.nameBn}>
                <Input id="nameBn" name="nameBn" defaultValue={initial.nameBn} required />
              </Field>
            </div>
            <Field
              label="URL slug"
              htmlFor="slug"
              error={errors.slug}
              hint={`Shown as /products/${slug || "…"}`}
            >
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Short description (English)" htmlFor="shortDescEn" error={errors.shortDescEn}>
                <Input id="shortDescEn" name="shortDescEn" defaultValue={initial.shortDescEn} required />
              </Field>
              <Field label="Short description (বাংলা)" htmlFor="shortDescBn" error={errors.shortDescBn}>
                <Input id="shortDescBn" name="shortDescBn" defaultValue={initial.shortDescBn} required />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Description (English)" htmlFor="descriptionEn" error={errors.descriptionEn}>
                <Textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  defaultValue={initial.descriptionEn}
                  rows={4}
                  required
                />
              </Field>
              <Field label="Description (বাংলা)" htmlFor="descriptionBn" error={errors.descriptionBn}>
                <Textarea
                  id="descriptionBn"
                  name="descriptionBn"
                  defaultValue={initial.descriptionBn}
                  rows={4}
                  required
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price &amp; stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="hasSizes"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              This product comes in sizes
            </label>

            {!hasSizes ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Price (৳)" htmlFor="price" error={errors.price}>
                  <Input
                    id="price"
                    name="price"
                    inputMode="numeric"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </Field>
                <Field
                  label="Compare-at price (৳)"
                  htmlFor="originalPrice"
                  error={errors.originalPrice}
                  hint="Optional. Shown struck through."
                >
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    inputMode="numeric"
                    defaultValue={initial.originalPrice}
                  />
                </Field>
                <Field label="Units in stock" htmlFor="stock" error={errors.stock}>
                  <Input id="stock" name="stock" inputMode="numeric" defaultValue={initial.stock} />
                </Field>
              </div>
            ) : (
              <div className="space-y-3">
                {errors.sizes && <p className="text-sm text-destructive">{errors.sizes}</p>}
                {sizes.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead className="text-left text-xs text-muted-foreground">
                        <tr>
                          <th className="pb-2 font-medium">Code</th>
                          <th className="pb-2 font-medium">Label (EN)</th>
                          <th className="pb-2 font-medium">Label (বাংলা)</th>
                          <th className="pb-2 font-medium">Price ৳</th>
                          <th className="pb-2 font-medium">Compare-at ৳</th>
                          <th className="pb-2 font-medium">Stock</th>
                          <th className="pb-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {sizes.map((size, index) => {
                          const err = (field: string) => errors[`sizes.${index}.${field}`];
                          const cell = (field: keyof SizeRow, props: { numeric?: boolean; width: string }) => (
                            <td className={`pr-2 pb-2 align-top ${props.width}`}>
                              <Input
                                value={size[field] ?? ""}
                                inputMode={props.numeric ? "numeric" : undefined}
                                aria-label={`${field} for size ${index + 1}`}
                                aria-invalid={err(field) ? true : undefined}
                                onChange={(e) => updateSize(index, { [field]: e.target.value })}
                              />
                              {err(field) && <p className="mt-1 text-xs text-destructive">{err(field)}</p>}
                            </td>
                          );
                          return (
                            <tr key={size.id ?? `new-${index}`}>
                              {cell("sizeId", { width: "w-20" })}
                              {cell("labelEn", { width: "w-24" })}
                              {cell("labelBn", { width: "w-24" })}
                              {cell("price", { numeric: true, width: "w-24" })}
                              {cell("originalPrice", { numeric: true, width: "w-24" })}
                              {cell("stock", { numeric: true, width: "w-20" })}
                              <td className="pb-2 align-top whitespace-nowrap">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Move up"
                                  disabled={index === 0}
                                  onClick={() => moveSize(index, -1)}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Move down"
                                  disabled={index === sizes.length - 1}
                                  onClick={() => moveSize(index, 1)}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Remove size"
                                  onClick={() => setSizes((rows) => rows.filter((_, i) => i !== index))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSizes((rows) => [
                        ...rows,
                        {
                          sizeId: "",
                          labelEn: "",
                          labelBn: "",
                          price: rows[0]?.price ?? basePrice,
                          originalPrice: rows[0]?.originalPrice ?? "",
                          stock: "0",
                        },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4" /> Add size
                  </Button>
                  {SIZE_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addPreset(preset)}
                    >
                      <Plus className="h-4 w-4" /> {preset.name}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  The first size&apos;s price is shown on product cards. Customers can&apos;t pick a
                  size with 0 stock.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="active"
                defaultChecked={initial.active}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <span className="font-medium">Visible in store</span>
                <span className="block text-xs text-muted-foreground">
                  Unticked products are hidden but keep their order history.
                </span>
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initial.featured}
                className="h-4 w-4 accent-primary"
              />
              <span className="font-medium">Featured on home page</span>
            </label>
            <div>
              <p className="mb-1.5 font-medium">Badges</p>
              <div className="flex flex-wrap gap-3">
                {BADGE_OPTIONS.map((badge) => (
                  <label key={badge.value} className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      name="badges"
                      value={badge.value}
                      defaultChecked={initial.badges.includes(badge.value)}
                      className="h-4 w-4 accent-primary"
                    />
                    {badge.label}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category &amp; photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Category" htmlFor="categoryId" error={errors.categoryId}>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={initial.categoryId}
                className={selectClassName}
                required
              >
                <option value="" disabled>
                  Choose…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Photo"
              htmlFor="image"
              error={errors.image}
              hint="A path under /public (e.g. /cloths/shirts/photo.jpg) or an https:// image URL."
            >
              <Input
                id="image"
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </Field>
            {/^(\/\S+|https:\/\/\S+)$/.test(image) && (
              <ProductImage
                src={image}
                alt="Preview"
                sizes="320px"
                className="aspect-square w-full rounded-xl"
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
          </Button>
          {initial.id &&
            (orderCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                In {orderCount} past order line{orderCount === 1 ? "" : "s"}, so it can&apos;t be
                deleted. Untick &ldquo;Visible in store&rdquo; to hide it.
              </p>
            ) : (
              <ConfirmButton
                label="Delete product"
                confirmLabel="Click again to delete"
                action={deleteProduct.bind(null, initial.id)}
              />
            ))}
        </div>
      </div>
    </form>
  );
}
