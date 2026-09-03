import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryBySlug, getAllCategory } from "@/src/entities/category/repository/getCategory"
import { getAllProducts } from "@/src/entities/product/repositiry/getProduct"
import { CatalogFilter } from "@/src/shared/components/catalog-filter"
import { CatalogView } from "@/src/shared/components/catalog-view"
import { Badge } from "@/src/shared/ui/badge"

export const revalidate = 3600

type CategoryPageProps = {
  params: Promise<{ slug: string }>
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategory(),
  ])

  if (!category) {
    notFound()
  }

  const products = await getAllProducts(category.slug)

  return (
    <section id="catalog" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">{products.length} товаров</Badge>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{category.name}</h1>
        <p className="max-w-2xl text-muted-foreground">
          Товары категории «{category.name}» с быстрым оформлением заказа.
        </p>
      </div>
      <CatalogFilter
        categories={categories}
        productCount={products.length}
        activeCategorySlug={category.slug}
      />
      <CatalogView visibleProducts={products} />
    </section>
  )
}
