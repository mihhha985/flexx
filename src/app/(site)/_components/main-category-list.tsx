import Link from "next/link"
import Image from "next/image"
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
            <CardContent className="flex flex-col items-center">
              {category.icon.startsWith("/") ? (
                <Image
                  src={category.icon}
                  alt={category.name}
                  height={100}
                  width={150}
                  className="h-25 w-auto"
                />
              ) : (
                <span className="flex aspect-4/3 w-full items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-150 group-hover:bg-secondary">
                  <CategoryIcon slug={category.slug} className="size-9" />
                </span>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
