"use client";

import { startTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Shirt,
  Tags,
  Users,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, showPending: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminSidebar({
  user,
  pendingCount,
}: {
  user: { name: string | null; email: string | null };
  pendingCount: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="border-b bg-card md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0">
      <div className="flex items-center justify-between gap-2 px-4 py-3 md:py-5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Shirt className="h-4 w-4" />
          </span>
          <span className="font-heading font-semibold">emart admin</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:hidden"
        >
          Store <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:pb-0">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.showPending && pendingCount > 0 && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 text-[11px] font-bold",
                    active ? "bg-primary-foreground text-primary" : "bg-brand text-brand-foreground"
                  )}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden space-y-1 border-t p-3 md:block">
        <p className="truncate px-2 text-xs text-muted-foreground">{user.name ?? user.email}</p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
        >
          <ExternalLink className="h-4 w-4" />
          View store
        </Link>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              await logout();
              // Hard navigation so no cached admin page survives the logout.
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/";
            })
          }
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
