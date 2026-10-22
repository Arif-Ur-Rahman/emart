import Link from "next/link";
import { Plus } from "lucide-react";
import { listAdminCategories } from "@/lib/data/admin";
import { PageHeader } from "@/components/admin/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <>
      <PageHeader
        title="Categories"
        actions={
          <Link href="/admin/categories/new" className={buttonVariants()}>
            <Plus className="h-4 w-4" /> New category
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/admin/categories/${category.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3">
                <span className="text-3xl">{category.emoji}</span>
                <div className="min-w-0">
                  <p className="font-medium">
                    {category.name.en}{" "}
                    <span className="font-normal text-muted-foreground">· {category.name.bn}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{category.slug} · {category.productCount} product
                    {category.productCount === 1 ? "" : "s"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
