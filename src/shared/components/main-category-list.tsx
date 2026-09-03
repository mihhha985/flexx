import Link from "next/link"
import { Card, CardContent } from "@/src/shared/ui/card";
import { CategoryIcon } from "@/src/shared/components/category-icon";
import { getAllCategory } from "@/src/entities/category/repository/getCategory";

export async function MainCategoryList() {
  const categories = await getAllCategory();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {categories.map((category) => (
        <Link key={category.slug} href={`/catalog/${category.slug}`} className="group">
          <Card size="sm" className="h-full transition-shadow group-hover:shadow-sm">
            <CardContent className="flex flex-col gap-3 pt-1">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <CategoryIcon slug={category.slug} className="size-4" />
              </span>
              <span className="font-medium">{category.name}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
