import { ProductCardSkeleton } from "@/src/shared/components/skeleton/product-card-skeleton"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function CatalogFilterSkeleton() {
  return (
    <div role="status" aria-label="Загрузка категорий" className="flex flex-col gap-3">
      <div aria-hidden="true" className="flex flex-col gap-3 [&_[data-slot=skeleton]]:motion-reduce:animate-none">
        <Skeleton className="h-8 w-full max-w-xl" />
        <div className="flex gap-2 overflow-hidden pb-1">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-24 shrink-0" />
          ))}
        </div>
      </div>
      <span className="sr-only">Загрузка категорий…</span>
    </div>
  )
}

export function CatalogResultsSkeleton() {
  return (
    <section aria-label="Результаты каталога" aria-busy="true" className="flex flex-col gap-4">
      <span role="status" className="sr-only">Загрузка товаров…</span>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <Skeleton aria-hidden="true" className="h-7 w-40 motion-reduce:animate-none" />
        <Skeleton aria-hidden="true" className="h-5 w-24 motion-reduce:animate-none" />
      </div>
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4 [&_[data-slot=skeleton]]:motion-reduce:animate-none">
        {Array.from({ length: 12 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}
