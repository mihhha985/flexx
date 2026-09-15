import type { Metadata } from "next"
import { getCategoriesForAdmin } from "@/src/entities/category/services/admin-category-service"
import { CategoriesTable } from "./categories-table"

export const metadata: Metadata = { title: "Категории" }

export default async function Page() {
  const data = await getCategoriesForAdmin()
  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Категории</h1>
        <p className="text-sm text-muted-foreground">
          Управление категориями и порядком их отображения в каталоге.
        </p>
      </div>
      <CategoriesTable data={data} />
    </section>
  )
}
