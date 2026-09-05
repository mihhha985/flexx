import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Badge } from "@/src/shared/ui/badge"
import { getCategoryBySlug, getAllCategory } from "@/src/entities/category/repository/getCategory"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { ProductPagination } from "@/src/shared/components/product-pagination"
import {
  getTotalActiveProducts,
  getValidatedProducts,
} from "@/src/entities/product/services/productService"


type CategoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const categories = await getAllCategory()

  return categories.map(({ slug }) => ({ slug }))
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

  const [products, totalProducts] = await Promise.all([
    getValidatedProducts(category.slug, search),
    getTotalActiveProducts(category.slug, search),
  ])

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-medium tracking-tight">{category.name}</h2>
        <Badge variant="secondary">Показано: {products.length} из {totalProducts}</Badge>
      </div>
      <CatalogView visibleProducts={products} />
      <div className="mt-8">
        <ProductPagination
          totalProducts={totalProducts}
          pathname={`/catalog/${category.slug}`}
          searchParams={search}
        />
      </div>
    </div>
  )
}
