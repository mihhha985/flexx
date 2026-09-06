import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Badge } from "@/src/shared/ui/badge"
import { getCategoryBySlug } from "@/src/entities/category/services/category-service"
import { CatalogView } from "@/src/app/(site)/catalog/_components/catalog-view"
import { ProductPagination } from "@/src/app/(site)/catalog/_components/product-pagination"
import { getCatalog } from "@/src/entities/product/services/product-service"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return { title: "Категория не найдена — Контур" }
  }

  return {
    title: `${category.name} — каталог товаров | Контур`,
    description: `Товары категории «${category.name}» в интернет-магазине «Контур».`,
    alternates: {
      canonical: `/catalog/${category.slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  const search = await searchParams
  if (!category) {
    notFound()
  }

  const { products, totalProducts, params: catalogParams } = await getCatalog(category.slug, search)

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-medium tracking-tight">{category.name}</h2>
        <Badge variant="secondary">
          Показано: {products.length} из {totalProducts}
        </Badge>
      </div>
      <CatalogView visibleProducts={products} />
      <div className="mt-8">
        <ProductPagination
          totalProducts={totalProducts}
          pathname={`/catalog/${category.slug}`}
          params={catalogParams}
        />
      </div>
    </div>
  )
}
