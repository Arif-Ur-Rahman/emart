import type { z } from "zod";

/** Result shape shared by the admin forms. `errors` is keyed by field path, e.g. "sizes.0.price". */
export type FormState = { errors?: Record<string, string>; message?: string } | undefined;

/** First error message per field path. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    errors[key] ??= issue.message;
  }
  return errors;
}
