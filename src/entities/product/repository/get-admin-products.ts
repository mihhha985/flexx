import "server-only"

import { db } from "@/src/prisma/db"

export async function getAdminProducts() {
  return db.orm.public.Product.select(
    "id",
    "name",
    "slug",
    "description",
    "imageUrl",
    "price",
    "stock",
    "isActive",
    "categoryId",
  )
    .include("category", (category) => category.select("name"))
    .orderBy([(product) => product.name.asc(), (product) => product.id.asc()])
    .all()
}
