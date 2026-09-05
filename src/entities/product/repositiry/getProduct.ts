"use server"

import { unstable_cache } from "next/cache"
import { db } from "@/src/prisma/db"
import type { ProductOrder, ProductSort, ProductWithCategory } from "../domain"

function getActiveProductsQuery(sort: ProductSort = "name", order: ProductOrder = "asc") {
  const products = db.orm.public.Product
    .select("id", "name", "slug", "stock", "price", "imageUrl", "isActive")
    .include("category", (category) => category.select("name", "slug", "order"))
    .where({ "isActive": true })

  return sort === "price"
    ? products.orderBy((product) => order === "asc" ? product.price.asc() : product.price.desc())
    : products.orderBy((product) => order === "asc" ? product.name.asc() : product.name.desc())
}

const getCachedProducts = unstable_cache(
  async (
    category: string,
    limit: number,
    offset: number,
    sort: ProductSort,
    order: ProductOrder,
  ): Promise<ProductWithCategory[]> => {
    const products = getActiveProductsQuery(sort, order)

    return await (category
      ? products.where((product) => product.category.some({ slug: category }))
      : products)
      .limit(limit)
      .offset(offset)
      .all()
  },
  ["active-products"],
  { revalidate: 3600, tags: ["products"] },
)

export async function getAllProducts(
  category?: string,
  limit = 12,
  offset = 0,
  sort: ProductSort = "name",
  order: ProductOrder = "asc",
): Promise<ProductWithCategory[]> {
  try {
    return await getCachedProducts(category ?? "", limit, offset, sort, order)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllActiveProducts(): Promise<ProductWithCategory[]> {
  try {
    return await getActiveProductsQuery().all()
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  try {
    return await db.orm.public.Product
      .select("id", "name", "slug", "stock", "price", "imageUrl", "description", "isActive")
      .include("category", (category) => category.select("name", "slug", "order"))
      .where({ "isActive": true, "slug": slug })
      .first()
  } catch (error) {
    console.error(error);
    throw error
  }
}
