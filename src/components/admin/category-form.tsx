"use client";

import { useState } from "react";
import Image from "next/image";
import { saveCategory, deleteCategory } from "@/lib/actions/admin/categories";
import type { FormState } from "@/lib/actions/admin/form-state";
import { CATEGORY_GRADIENTS } from "@/lib/category-styles";
import { useFormAction } from "./use-form-action";
import { Field, selectClassName } from "./field";
import { ConfirmButton } from "./confirm-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, isRemoteImage } from "@/lib/utils";

export type CategoryFormValues = {
  id?: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  taglineEn: string;
  taglineBn: string;
  emoji: string;
  image: string;
  gradient: string;
};

export function CategoryForm({
  initial,
  productCount,
}: {
  initial: CategoryFormValues;
  productCount: number;
}) {
  const [state, onSubmit, pending] = useFormAction<FormState>(saveCategory, undefined);
  const errors = state?.errors ?? {};
  const [image, setImage] = useState(initial.image);
  const [gradient, setGradient] = useState(initial.gradient);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <Card className="lg:col-span-2">
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name (English)" htmlFor="nameEn" error={errors.nameEn}>
              <Input id="nameEn" name="nameEn" defaultValue={initial.nameEn} required />
            </Field>
            <Field label="Name (বাংলা)" htmlFor="nameBn" error={errors.nameBn}>
              <Input id="nameBn" name="nameBn" defaultValue={initial.nameBn} required />
            </Field>
            <Field label="Tagline (English)" htmlFor="taglineEn" error={errors.taglineEn}>
              <Input id="taglineEn" name="taglineEn" defaultValue={initial.taglineEn} required />
            </Field>
            <Field label="Tagline (বাংলা)" htmlFor="taglineBn" error={errors.taglineBn}>
              <Input id="taglineBn" name="taglineBn" defaultValue={initial.taglineBn} required />
            </Field>
            <Field
              label="URL slug"
              htmlFor="slug"
              error={errors.slug}
              hint="Shown as /category/<slug>"
            >
              <Input id="slug" name="slug" defaultValue={initial.slug} required />
            </Field>
            <Field label="Emoji" htmlFor="emoji" error={errors.emoji} hint="Used in menus.">
              <Input id="emoji" name="emoji" defaultValue={initial.emoji} required />
            </Field>
          </div>
          <Field
            label="Photo"
            htmlFor="image"
            error={errors.image}
            hint="A path under /public or an https:// image URL."
          >
            <Input
              id="image"
              name="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Field>
          <Field label="Background" htmlFor="gradient" error={errors.gradient}>
            <select
              id="gradient"
              name="gradient"
              value={gradient}
              onChange={(e) => setGradient(e.target.value)}
              className={selectClassName}
            >
              {CATEGORY_GRADIENTS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br ring-1 ring-border",
            gradient
          )}
        >
          {/^(\/\S+|https:\/\/\S+)$/.test(image) && (
            <Image
              src={image}
              alt="Preview"
              fill
              sizes="320px"
              unoptimized={isRemoteImage(image)}
              className="object-cover"
            />
          )}
        </div>
        {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Saving…" : initial.id ? "Save changes" : "Create category"}
        </Button>
        {initial.id &&
          (productCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              Has {productCount} product{productCount === 1 ? "" : "s"}; move them to another
              category before deleting.
            </p>
          ) : (
            <ConfirmButton
              label="Delete category"
              confirmLabel="Click again to delete"
              action={deleteCategory.bind(null, initial.id)}
            />
          ))}
      </div>
    </form>
  );
}
