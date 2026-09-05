import { getAllProducts } from "@/src/entities/product/repositiry/getProduct"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { CatalogResultsTransition } from "@/src/shared/components/catalog-results-transition"
import { Badge } from "@/src/shared/ui/badge"

export async function CatalogResults({
  categorySlug,
  categoryOrder,
  title = "Все товары",
}: {
  categorySlug?: string
  categoryOrder?: number
  title?: string
}) {
  const products = await getAllProducts(categorySlug)

  return (
    <CatalogResultsTransition
      key={categorySlug ?? "all"}
      categorySlug={categorySlug}
      categoryOrder={categoryOrder}
    >
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        <Badge variant="secondary">Показано: {products.length}</Badge>
      </div>
      <CatalogView visibleProducts={products} />
    </CatalogResultsTransition>
  )
}
