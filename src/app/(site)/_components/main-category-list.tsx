import Link from "next/link"
import { Card, CardContent } from "@/src/shared/ui/card"
import { CategoryIcon } from "@/src/app/(site)/_components/category-icon"
import { getCategories } from "@/src/entities/category/services/category-service"

export async function MainCategoryList() {
  const categories = await getCategories()

  return (
    <div className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/catalog/${category.slug}`}
          className="ui-focus group rounded-xl"
        >
          <Card size="sm" variant="plain" className="h-full gap-3">
            <CardContent>
              <span className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-150 group-hover:bg-secondary">
                <CategoryIcon slug={category.slug} className="size-9" />
              </span>
            </CardContent>
            <span className="font-medium">{category.name}</span>
          </Card>
        </Link>
      ))}
    </div>
  )
}
