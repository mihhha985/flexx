import "server-only"
import { db } from "@/src/prisma/db"
import { or } from "@prisma/orm-postgres/orm-client"
import type { CatalogParams } from "../catalog-params"
import { PRODUCTS_PER_PAGE } from "../catalog-params"

function filteredProducts(category: string | undefined, search: string | undefined) {
  let products = db.orm.public.Product.where({ isActive: true })
  if (category) products = products.where((product) => product.category.some({ slug: category }))
  if (search)
    products = products.where((product) =>
      or(product.name.ilike(`%${search}%`), product.description.ilike(`%${search}%`)),
    )
  return products
}

export async function getCatalogProducts(category: string | undefined, params: CatalogParams) {
  const products = filteredProducts(category, params.search)
    .select("id", "name", "slug", "stock", "price", "avatar", "images", "isActive")
    .orderBy([
      (product) =>
        params.sort === "price"
          ? params.order === "asc"
            ? product.price.asc()
            : product.price.desc()
          : params.order === "asc"
            ? product.name.asc()
            : product.name.desc(),
      (product) => product.id.asc(),
    ])
  return products
    .limit(PRODUCTS_PER_PAGE)
    .offset((params.page - 1) * PRODUCTS_PER_PAGE)
    .all()
}

export async function getActiveProductsCount(category?: string, search?: string) {
  const { total } = await filteredProducts(category, search).aggregate((aggregate) => ({
    total: aggregate.count(),
  }))
  return total
}

export async function getAllActiveProducts() {
  return db.orm.public.Product.select(
    "id",
    "name",
    "slug",
    "stock",
    "price",
    "avatar",
    "images",
    "description",
    "isActive",
  )
    .include("category", (category) => category.select("name", "slug", "order", "icon"))
    .where({ isActive: true })
    .all()
}

export async function getActiveProductSlugs() {
  return db.orm.public.Product.select("slug").where({ isActive: true }).all()
}

export async function getProductBySlug(slug: string) {
  return db.orm.public.Product.select(
    "id",
    "name",
    "slug",
    "stock",
    "price",
    "avatar",
    "images",
    "description",
    "isActive",
  )
    .include("category", (category) => category.select("name", "slug", "order", "icon"))
    .include("detail", (detail) => detail.select("color", "size", "country"))
    .where({ isActive: true, slug })
    .first()
}
