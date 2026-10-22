"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/actions/admin/form-state";

/** Two-click destructive button (no browser confirm dialog). Shows the action's error, if any. */
export function ConfirmButton({
  label,
  confirmLabel,
  action,
}: {
  label: string;
  confirmLabel: string;
  action: () => Promise<FormState>;
}) {
  const [armed, setArmed] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="destructive"
          disabled={pending}
          onClick={() => {
            if (!armed) {
              setArmed(true);
              return;
            }
            startTransition(async () => {
              const result = await action();
              setMessage(result?.message);
              setArmed(false);
            });
          }}
        >
          {armed ? confirmLabel : label}
        </Button>
        {armed && (
          <Button type="button" variant="ghost" disabled={pending} onClick={() => setArmed(false)}>
            Keep
          </Button>
        )}
      </div>
      {message && <p className="text-sm text-destructive">{message}</p>}
    </div>
  );
}
