import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Images pasted in the admin as https URLs can come from any host, so they're
 * served as-is (`unoptimized`) instead of allow-listing hosts for the optimizer.
 */
export function isRemoteImage(src: string): boolean {
  return /^https?:\/\//.test(src)
}
