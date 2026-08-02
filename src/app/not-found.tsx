import Link from "next/link";

import { MalotiMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-32 text-center">
      <MalotiMark className="size-10 text-primary" />
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-semibold">
          This one has been sold.
        </h1>
        <p className="text-sm text-muted-foreground">
          The page you were looking for isn&apos;t here. It may have moved, or
          the piece may have gone out of the catalogue.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="h-11 px-7">
          <Link href="/shop">Browse the shop</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 px-7">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
