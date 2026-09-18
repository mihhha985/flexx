import "server-only"

import { db } from "@/src/prisma/db"

function adminProducts() {
  return db.orm.public.Product.select(
    "id",
    "name",
    "slug",
    "description",
    "country",
    "isActive",
    "categoryId",
  ).include("variants", (variants) =>
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
      .orderBy((variant) => variant.order.asc()),
  )
}

export async function getAdminProducts() {
  return adminProducts()
    .orderBy([(product) => product.name.asc(), (product) => product.id.asc()])
    .all()
}

export async function getAdminProduct(id: number) {
  return adminProducts().where({ id }).first()
}
