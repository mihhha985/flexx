import "server-only"
import { db } from "@/src/prisma/db"

export async function getCategories() {
  return db.orm.public.Category.select("name", "slug", "order")
    .orderBy([(category) => category.order.asc(), (category) => category.id.asc()])
    .all()
}

export async function getCategoryBySlug(slug: string) {
  return db.orm.public.Category.select("name", "slug", "order").where({ slug }).first()
}
