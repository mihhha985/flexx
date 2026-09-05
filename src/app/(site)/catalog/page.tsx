import type { Metadata } from "next"
import { Badge } from "@/src/shared/ui/badge"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { ProductPagination } from "@/src/shared/components/product-pagination"
import {
  getTotalActiveProducts,
  getValidatedProducts,
} from "@/src/entities/product/services/productService"

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
  const [products, totalProducts] = await Promise.all([
    getValidatedProducts(undefined, search),
    getTotalActiveProducts(undefined, search),
  ])

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-medium tracking-tight">Все товары</h2>
        <Badge variant="secondary">Показано: {products.length} из {totalProducts}</Badge>
      </div>
      <CatalogView visibleProducts={products} />
      <div className="mt-8">
        <ProductPagination totalProducts={totalProducts} searchParams={search} />
      </div>
    </div>
  )
}
