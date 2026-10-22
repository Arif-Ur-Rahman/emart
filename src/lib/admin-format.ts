import type { OrderStatus } from "@/generated/prisma/enums";
import { formatPrice } from "@/lib/format";

/** The shop's local time zone — admin dates and "today"/"this month" use it. */
export const STORE_TIME_ZONE = "Asia/Dhaka";
// Bangladesh has no daylight saving time, so its UTC offset is fixed.
const STORE_UTC_OFFSET = "+06:00";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function formatTaka(amount: number): string {
  return formatPrice(amount, "en");
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: STORE_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: STORE_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function storeDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Midnight at the start of today, in the store's time zone. */
export function startOfStoreDay(now = new Date()): Date {
  const { year, month, day } = storeDateParts(now);
  return new Date(`${year}-${month}-${day}T00:00:00${STORE_UTC_OFFSET}`);
}

/** Midnight on the 1st of this month, in the store's time zone. */
export function startOfStoreMonth(now = new Date()): Date {
  const { year, month } = storeDateParts(now);
  return new Date(`${year}-${month}-01T00:00:00${STORE_UTC_OFFSET}`);
}
