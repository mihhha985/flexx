import type { Metadata } from "next"
import { getCategoriesForAdmin } from "@/src/entities/category/services/adminCategoryService"
import { getProductsForAdmin } from "@/src/entities/product/services/adminProductService"
import { ProductsTable } from "./products-table"

export const metadata: Metadata = { title: "Товары — Контур" }

export default async function Page() {
  const [data, categories] = await Promise.all([getProductsForAdmin(), getCategoriesForAdmin()])
  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Товары</h1>
        <p className="text-sm text-muted-foreground">Управление товарами: цены, остатки и видимость в каталоге.</p>
      </div>
      <ProductsTable data={data} categories={categories} />
    </section>
  )
}
