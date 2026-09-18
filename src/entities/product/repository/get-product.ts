import "server-only"

import { or } from "@prisma/orm-postgres/orm-client"

import { db } from "@/src/prisma/db"

function activeProducts(category: string | undefined, search: string | undefined) {
  let products = db.orm.public.Product.where({ isActive: true }).where((product) =>
    product.variants.some({ isActive: true, order: 0 }),
  )
  if (category) products = products.where((product) => product.category.some({ slug: category }))
  if (search) {
    products = products.where((product) =>
      or(product.name.ilike(`%${search}%`), product.description.ilike(`%${search}%`)),
    )
  }
  return products
}

function withPrimaryVariant(category: string | undefined, search: string | undefined) {
  return activeProducts(category, search)
    .select("id", "name", "slug", "description", "isActive")
    .include("variants", (variants) =>
      variants
        .select(
          "id",
          "colorName",
          "colorSlug",
          "colorHex",
          "price",
          "avatar",
          "images",
          "isActive",
          "order",
        )
        .include("sizes", (sizes) =>
          sizes.select("id", "size", "stock").orderBy((item) => item.size.asc()),
        )
        .where({ isActive: true, order: 0 })
        .limit(1),
    )
}

export async function getCatalogProductRows(category?: string, search?: string) {
  return withPrimaryVariant(category, search).all()
}

export async function getAllActiveProductRows() {
  return withPrimaryVariant(undefined, undefined)
    .include("category", (category) => category.select("name", "slug", "order", "icon"))
    .all()
}

export async function getActiveProductSlugs() {
  return activeProducts(undefined, undefined).select("slug").all()
}

export async function getProductBySlug(slug: string) {
  return db.orm.public.Product.select("id", "name", "slug", "description", "country", "isActive")
    .include("category", (category) => category.select("name", "slug", "order", "icon"))
    .include("variants", (variants) =>
      variants
        .select(
          "id",
          "colorName",
          "colorSlug",
          "colorHex",
          "price",
          "avatar",
          "images",
          "isActive",
          "order",
        )
        .include("sizes", (sizes) =>
          sizes.select("id", "size", "stock").orderBy((item) => item.size.asc()),
        )
        .where({ isActive: true })
        .orderBy((variant) => variant.order.asc()),
    )
    .where({ isActive: true, slug })
    .first()
}
