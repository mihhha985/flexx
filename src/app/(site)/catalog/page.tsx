import type { Metadata } from "next"
import { Badge } from "@/src/shared/ui/badge"
import { CatalogView } from "@/src/app/(site)/catalog/_components/catalog-view"
import { ProductPagination } from "@/src/app/(site)/catalog/_components/product-pagination"
import { getCatalog } from "@/src/entities/product/services/product-service"

export const metadata: Metadata = {
  title: "Каталог товаров — Контур",
  description: "Каталог товаров с быстрым поиском и фильтрацией по категориям.",
  alternates: {
    canonical: "/catalog",
  },
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const search = await searchParams
  const { products, totalProducts, params: catalogParams } = await getCatalog(undefined, search)

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-medium tracking-tight">Все товары</h2>
        <Badge variant="secondary">
          Показано: {products.length} из {totalProducts}
        </Badge>
      </div>
      <CatalogView visibleProducts={products} />
      <div className="mt-8">
        <ProductPagination totalProducts={totalProducts} params={catalogParams} />
      </div>
    </div>
  )
}
