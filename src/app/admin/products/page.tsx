import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { listAdminCategories, listAdminProducts } from "@/lib/data/admin";
import { formatTaka } from "@/lib/admin-format";
import { PageHeader } from "@/components/admin/page-header";
import { selectClassName } from "@/components/admin/field";
import { ProductImage } from "@/components/product/product-image";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Products" };

function StockCell({ stock, outOfStockSizes }: { stock: number; outOfStockSizes: number }) {
  return (
    <div>
      <span
        className={cn(
          "font-medium tabular-nums",
          stock === 0 && "text-destructive",
          stock > 0 && stock <= 5 && "text-amber-700"
        )}
      >
        {stock === 0 ? "Sold out" : stock}
      </span>
      {stock > 0 && outOfStockSizes > 0 && (
        <p className="text-xs text-muted-foreground">
          {outOfStockSizes} size{outOfStockSizes === 1 ? "" : "s"} sold out
        </p>
      )}
    </div>
  );
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [products, categories] = await Promise.all([
    listAdminProducts({ q, categoryId: category || undefined }),
    listAdminCategories(),
  ]);

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"}`}
        actions={
          <Link href="/admin/products/new" className={buttonVariants()}>
            <Plus className="h-4 w-4" /> New product
          </Link>
        }
      />

      <form action="/admin/products" className="mb-4 flex flex-wrap gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search by name or slug"
          className="w-full sm:w-64"
          aria-label="Search products"
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className={cn(selectClassName, "w-auto")}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.en}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" /> Filter
        </Button>
      </form>

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No products match.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                      <ProductImage
                        src={product.image}
                        alt={product.name.en}
                        sizes="40px"
                        className="h-10 w-10 shrink-0 rounded-lg"
                      />
                      <span>
                        <span className="font-medium underline-offset-4 hover:underline">
                          {product.name.en}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {product.sizeCount > 0 ? `${product.sizeCount} sizes` : "No sizes"}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">{product.category.en}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatTaka(product.price)}</td>
                  <td className="px-4 py-3">
                    <StockCell stock={product.stock} outOfStockSizes={product.outOfStockSizes} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          product.active ? "bg-emerald-100 text-emerald-900" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {product.active ? "Visible" : "Hidden"}
                      </span>
                      {product.featured && (
                        <span className="rounded-full border px-2 py-0.5 text-xs">Featured</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
