import { Suspense } from "react"

import { getAllCategory } from "@/src/entities/category/repository/getCategory"
import { CatalogFilter } from "@/src/shared/components/catalog-filter"
import { CatalogTransitionProvider } from "@/src/shared/components/catalog-results-transition"
import { CatalogFilterSkeleton } from "@/src/shared/components/skeleton/catalog-skeleton"

async function CatalogFilters() {
  const categories = await getAllCategory()

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
      <CatalogTransitionProvider>{children}</CatalogTransitionProvider>
    </section>
  )
}
