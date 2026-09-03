import type { Metadata } from "next"

import { getAllProducts } from "@/src/entities/product/repositiry/getProduct"
import { getAllCategory } from "@/src/entities/category/repository/getCategory"
import { CatalogFilter } from "@/src/shared/components/catalog-filter"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { Badge } from "@/src/shared/ui/badge"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Каталог товаров — Контур",
  description: "Каталог товаров с быстрым поиском и фильтрацией по категориям.",
  alternates: {
    canonical: "/catalog",
  },
}

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategory(),
  ])

  return (
    <section id="catalog" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">{products.length} товаров</Badge>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Каталог товаров</h1>
        <p className="max-w-2xl text-muted-foreground">
          Выберите категорию или найдите подходящий товар в общем каталоге.
        </p>
      </div>
      <CatalogFilter categories={categories} productCount={products.length} />
      <CatalogView visibleProducts={products} />
    </section>
  )
}
