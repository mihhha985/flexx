import { getAllProducts } from "@/src/entities/product/repositiry/getProduct"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { Badge } from "@/src/shared/ui/badge"

export async function CatalogResults({
  categorySlug,
  title = "Все товары",
}: {
  categorySlug?: string
  title?: string
}) {
  const products = await getAllProducts(categorySlug)

  return (
    <section aria-label="Результаты каталога" className="flex flex-col gap-4">
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        <Badge variant="secondary">Показано: {products.length}</Badge>
      </div>
      <CatalogView visibleProducts={products} />
    </section>
  )
}
