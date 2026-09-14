import "server-only"

import { db } from "@/src/prisma/db"

function adminProducts() {
  return db.orm.public.Product.select(
    "id",
    "name",
    "slug",
    "description",
    "avatar",
    "images",
    "price",
    "stock",
    "isActive",
    "categoryId",
  ).include("detail", (detail) => detail.select("color", "size", "country"))
}

export async function getAdminProducts() {
  return adminProducts()
    .orderBy([(product) => product.name.asc(), (product) => product.id.asc()])
    .all()
}

export async function getAdminProduct(id: number) {
  return adminProducts().where({ id }).first()
}
