import { ProductCardSkeleton } from "@/src/shared/components/skeleton/product-card-skeleton"
import { Card, CardContent } from "@/src/shared/ui/card"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function MainCategoryListSkeleton() {
  return (
    <div role="status" aria-label="Загрузка категорий">
      <span className="sr-only">Загрузка категорий…</span>
      <div aria-hidden="true" className="grid grid-cols-2 gap-3 md:grid-cols-5 [&_[data-slot=skeleton]]:motion-reduce:animate-none">
        {Array.from({ length: 5 }, (_, index) => (
          <Card key={index} size="sm" className="h-full">
            <CardContent className="flex flex-col gap-3 pt-1">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
            </CardContent>
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
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)}
      </div>
    </div>
  )
}
