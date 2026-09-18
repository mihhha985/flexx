import { SlidersHorizontalIcon } from "lucide-react"
import { ProductCard } from "@/src/entities/product/ui/product-card"
import { LinkButton } from "@/src/shared/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"
import type { Product } from "@/src/entities/product/domain"
export function CatalogView({ visibleProducts }: { visibleProducts: Product[] }) {
  return (
    <div>
      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.variantId} product={product} />
          ))}
        </div>
      ) : (
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SlidersHorizontalIcon />
            </EmptyMedia>
            <EmptyTitle>Ничего не найдено</EmptyTitle>
            <EmptyDescription>
              Попробуйте изменить запрос или выбрать другую категорию.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <LinkButton href="/catalog" variant="outline">
              Сбросить фильтры
            </LinkButton>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
