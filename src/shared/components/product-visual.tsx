import { CategoryIcon } from "@/src/shared/components/category-icon"
import type {  ProductWithCategory } from "@/src/entities/product/domain";
import { cn } from "@/src/shared/lib/utils"

export function ProductVisual(
  { product, compact = false }: { product: ProductWithCategory; compact?: boolean }
) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        compact
          ? "aspect-square size-20 shrink-0 rounded-lg [&_svg]:size-7"
          : "aspect-4/3 w-full [&_svg]:size-10",
      )}
      role="img"
      aria-label={`Изображение товара ${product.name}`}
    >
      <CategoryIcon slug={product.category.slug} />
    </div>
  )
}
