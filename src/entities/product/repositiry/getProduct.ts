"use server"
import { db } from "@/src/prisma/db"
import { or } from "@prisma/orm-postgres/orm-client"
import type {
  ProductOrder,
  ProductSort,
  Product,
  ProductWithCategory
} from "../domain"
import { LIMIT } from "../domain"

function getActiveProductsQuery(sort: ProductSort = "name", order: ProductOrder = "asc") {
  const products = db.orm.public.Product
    .select("id", "name", "slug", "stock", "price", "imageUrl", "isActive")
    .where({ "isActive": true })

  return sort === "price"
    ? products.orderBy((product) => order === "asc" ? product.price.asc() : product.price.desc())
    : products.orderBy((product) => order === "asc" ? product.name.asc() : product.name.desc())
}

export async function getAllProductsByCategory(
  category?: string,
  limit = LIMIT,
  offset = 0,
  sort: ProductSort = "name",
  order: ProductOrder = "asc",
  search?: string,
): Promise<Product[]> {
  try {
    const products = getActiveProductsQuery(sort, order)
    const productsInCategory = category
      ? products.where((product) => product.category.some({ slug: category }))
      : products
    const query = search?.trim()

    return await (query
      ? productsInCategory.where((product) =>
        or(
          product.name.ilike(`%${query}%`),
          product.description.ilike(`%${query}%`),
        ),
      )
      : productsInCategory)
      .limit(limit)
      .offset(offset)
      .all()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllActiveProducts(): Promise<ProductWithCategory[]> {
  try {
    return await db.orm.public.Product
      .select("id", "name", "slug", "stock", "price", "imageUrl", "description", "isActive")
      .include("category", (category) => category.select("name", "slug", "order"))
      .where({ "isActive": true })
      .all()
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getActiveProductsCount(
  category?: string,
  search?: string,
): Promise<number> {
  try {
    const products = db.orm.public.Product
      .where({ "isActive": true })
    const productsInCategory = category
      ? products.where((product) => product.category.some({ slug: category }))
      : products
    const query = search?.trim()

    const { total } = await (query
      ? productsInCategory.where((product) =>
        or(
          product.name.ilike(`%${query}%`),
          product.description.ilike(`%${query}%`),
        ),
      )
      : productsInCategory)
      .aggregate((aggregate) => ({ total: aggregate.count() }))

    return total
  } catch (error) {
    console.error(error)
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
