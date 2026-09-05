import type { Metadata } from "next"
import { Badge } from "@/src/shared/ui/badge"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { getValidatedProducts } from "@/src/entities/product/services/productService"

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
  const products = await getValidatedProducts(undefined, search)

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-medium tracking-tight">Все товары</h2>
        <Badge variant="secondary">Показано: {products.length}</Badge>
      </div>
      <CatalogView visibleProducts={products} />
    </div>
  )
}
