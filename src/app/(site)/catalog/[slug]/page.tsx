import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryBySlug, getAllCategory } from "@/src/entities/category/repository/getCategory"
import { CatalogResults } from "@/src/shared/components/catalog-results"

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
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return <CatalogResults categorySlug={category.slug} categoryOrder={category.order} title={category.name} />
}
