import Link from "next/link";
import { Search } from "lucide-react";
import { listCustomers } from "@/lib/data/admin";
import { formatDate, formatTaka } from "@/lib/admin-format";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const customers = await listCustomers({ q, page: Number(params.page) || 1 });

  return (
    <>
      <PageHeader title="Customers" description={`${customers.total} accounts`} />

      <form action="/admin/customers" className="mb-4 flex gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email"
          className="w-full sm:w-64"
          aria-label="Search customers"
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 text-right font-medium">Orders</th>
                <th className="px-4 py-3 text-right font-medium">Delivered spend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No customers match.
                  </td>
                </tr>
              )}
              {customers.rows.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {customer.name ?? "—"}
                      {customer.role === "ADMIN" && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3">{customer.phone ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {customer.orderCount > 0 && customer.email ? (
                      <Link
                        href={`/admin/orders?q=${encodeURIComponent(customer.email)}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {customer.orderCount}
                      </Link>
                    ) : (
                      customer.orderCount
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatTaka(customer.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination
        page={customers.page}
        pageCount={customers.pageCount}
        total={customers.total}
        basePath="/admin/customers"
        params={{ q }}
      />
    </>
  );
}
