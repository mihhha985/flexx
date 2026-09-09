import { ProductCardSkeleton } from "@/src/entities/product/ui/product-card-skeleton"
import { Card, CardContent } from "@/src/shared/ui/card"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function MainCategoryListSkeleton() {
  return (
    <div role="status" aria-label="Загрузка категорий">
      <span className="sr-only">Загрузка категорий…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6 [&_[data-slot=skeleton]]:motion-reduce:animate-none"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Card key={index} size="sm" variant="plain" className="h-full gap-3">
            <CardContent>
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            </CardContent>
            <Skeleton className="h-5 w-3/4" />
          </Card>
        ))}
      </div>
    </div>
  )
}

export function FeaturedProductsSkeleton() {
  return (
    <div role="status" aria-label="Загрузка популярных товаров">
      <span className="sr-only">Загрузка популярных товаров…</span>
      <div className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
