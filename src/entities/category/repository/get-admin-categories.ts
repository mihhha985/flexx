import "server-only"

import { db } from "@/src/prisma/db"

export async function getAdminCategories() {
  return db.orm.public.Category.select("id", "name", "slug", "order")
    .include("products", (products) => products.count())
    .orderBy([(category) => category.order.asc(), (category) => category.id.asc()])
    .all()
}
