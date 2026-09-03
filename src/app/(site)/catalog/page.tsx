import { CatalogView } from "@/src/shared/components/catalog-view"
import { Badge } from "@/src/shared/ui/badge"
import { getAllProducts } from "@/src/entities/product/repositiry/getProduct"
import type { Metadata } from "next"
import { CatalogFilter } from "@/src/shared/components/catalog-filter"
import { getAllCategory } from "@/src/entities/category/repository/getCategory"

export const metadata: Metadata = {
  title: "Каталог — Контур",
  description: "Каталог товаров с быстрым поиском и фильтрацией по категориям.",
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
  }) {

  const { category } = await searchParams;
  console.log("category", category);
  const products = await getAllProducts(category);
  const categories = await getAllCategory();

  return (
    <section id="catalog" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">{products.length} товаров</Badge>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Каталог</h1>
        <p className="max-w-2xl text-muted-foreground">Найдите товар по названию или выберите нужную категорию.</p>
      </div>
      <CatalogFilter categories={categories} productCount={products.length} />
      <CatalogView visibleProducts={products} />
    </section>
  )
}
