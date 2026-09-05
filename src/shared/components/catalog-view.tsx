
import { SlidersHorizontalIcon } from "lucide-react"
import { ProductCard } from "@/src/shared/components/product-card"
import { Button } from "@/src/shared/ui/button"
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
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><SlidersHorizontalIcon /></EmptyMedia>
            <EmptyTitle>Ничего не найдено</EmptyTitle>
            <EmptyDescription>Попробуйте изменить запрос или выбрать другую категорию.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline">
              Сбросить фильтры
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
