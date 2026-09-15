import type { MetadataRoute } from "next"

import { SITE_URL } from "@/env"
import { getCategories } from "@/src/entities/category/services/category-service"
import { getActiveProductSlugs } from "@/src/entities/product/services/product-service"

export const revalidate = 3600

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getActiveProductSlugs()])

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/catalog"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/contacts"), changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((category) => ({
      url: absoluteUrl(`/catalog/${category.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]
}
