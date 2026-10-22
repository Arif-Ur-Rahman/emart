import type { Metadata } from "next";
import { verifyAdmin } from "@/lib/dal";
import { getPendingOrderCount } from "@/lib/data/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: { default: "Admin · emart", template: "%s · emart admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await verifyAdmin();
  const pendingCount = await getPendingOrderCount();

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 md:flex-row">
      <AdminSidebar user={{ name: admin.name, email: admin.email }} pendingCount={pendingCount} />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
