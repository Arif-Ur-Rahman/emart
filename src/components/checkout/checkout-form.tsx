"use client";

import { useActionState } from "react";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice } from "@/lib/format";
import { calculateShipping } from "@/lib/shipping";
import { placeOrder, type CheckoutFormState } from "@/lib/actions/checkout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const { t, tl, lang } = useLanguage();
  const [state, action, pending] = useActionState<CheckoutFormState, FormData>(
    placeOrder,
    undefined
  );

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading mb-6 text-2xl font-semibold sm:text-3xl">
        {t("checkout.title")}
      </h1>
      <div className="grid gap-8 lg:grid-cols-3">
      <form action={action} className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("checkout.address")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium">
                {t("checkout.fullName")}
              </label>
              <Input id="fullName" name="fullName" required autoComplete="name" />
              {state?.errors?.fullName && (
                <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                {t("checkout.phone")}
              </label>
              <Input id="phone" name="phone" required autoComplete="tel" />
              {state?.errors?.phone && (
                <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="line1" className="text-sm font-medium">
                {t("checkout.addressLine1")}
              </label>
              <Input id="line1" name="line1" required autoComplete="address-line1" />
              {state?.errors?.line1 && (
                <p className="text-sm text-destructive">{state.errors.line1[0]}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="line2" className="text-sm font-medium">
                {t("checkout.addressLine2")}
              </label>
              <Input id="line2" name="line2" autoComplete="address-line2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="city" className="text-sm font-medium">
                  {t("checkout.city")}
                </label>
                <Input id="city" name="city" required autoComplete="address-level2" />
                {state?.errors?.city && (
                  <p className="text-sm text-destructive">{state.errors.city[0]}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  {t("checkout.postalCode")}
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  required
                  autoComplete="postal-code"
                />
                {state?.errors?.postalCode && (
                  <p className="text-sm text-destructive">{state.errors.postalCode[0]}</p>
                )}
              </div>
            </div>

            {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}

            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {t("checkout.placeOrder")}
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-lg">{t("checkout.orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">
                    {tl(item.name)}
                    {item.variantLabel && ` (${tl(item.variantLabel)})`}
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity, lang)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span className="font-medium">{formatPrice(subtotal, lang)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span className="font-medium">
                {shipping === 0 ? t("cart.shipping.free") : formatPrice(shipping, lang)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>{t("cart.total")}</span>
              <span className="text-primary">{formatPrice(total, lang)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
