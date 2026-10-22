import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-muted-foreground">That record doesn&apos;t exist or was deleted.</p>
      <Link href="/admin" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
        Back to dashboard
      </Link>
    </div>
  );
}
