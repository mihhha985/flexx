import { Suspense } from "react"

import { getCategories } from "@/src/entities/category/services/category-service"
import { CatalogFilter } from "@/src/app/(site)/catalog/_components/catalog-filter"
import { CatalogFilterSkeleton } from "@/src/app/(site)/catalog/_components/catalog-skeleton"

async function CatalogFilters() {
  const categories = await getCategories()

  return <CatalogFilter categories={categories} />
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section id="catalog" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Каталог товаров</h1>
        <p className="max-w-2xl text-muted-foreground">
          Выберите категорию или найдите подходящий товар в общем каталоге.
        </p>
      </div>
      <Suspense fallback={<CatalogFilterSkeleton />}>
        <CatalogFilters />
      </Suspense>
      {children}
    </section>
  )
}
