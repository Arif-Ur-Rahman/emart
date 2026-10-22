"use client";

import { useState } from "react";
import { saveAdminNote, type AdminNoteState } from "@/lib/actions/admin/orders";
import { useFormAction } from "./use-form-action";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AdminNoteForm({ orderId, note }: { orderId: string; note: string | null }) {
  const [state, onSubmit, pending] = useFormAction<AdminNoteState>(
    saveAdminNote.bind(null, orderId),
    undefined
  );
  const [dirty, setDirty] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        onSubmit(event);
        setDirty(false);
      }}
      className="space-y-2"
    >
      <Textarea
        name="adminNote"
        defaultValue={note ?? ""}
        rows={3}
        maxLength={2000}
        placeholder="Only staff see this, e.g. 'Customer asked for evening delivery'."
        onChange={() => setDirty(true)}
        aria-label="Internal note"
      />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          Save note
        </Button>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        {state?.ok && !dirty && !pending && <p className="text-sm text-muted-foreground">Saved.</p>}
      </div>
    </form>
  );
}
