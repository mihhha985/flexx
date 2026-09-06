import "server-only"

import { db } from "@/src/prisma/db"
import { requireAdmin } from "@/src/entities/admin/services/sessionService"

export async function getAdminCategories() {
  await requireAdmin()
  return db.orm.public.Category
    .select("id", "name", "slug", "order")
    .include("products", (products) => products.count())
    .orderBy([(category) => category.order.asc(), (category) => category.id.asc()])
    .all()
}
