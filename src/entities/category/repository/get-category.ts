import "server-only"
import { db } from "@/src/prisma/db"
import type { Category } from "@/src/entities/category/domain"

export async function getCategories(): Promise<Category[]> {
  return db.orm.public.Category.select("name", "slug", "order", "icon")
    .orderBy([(category) => category.order.asc(), (category) => category.id.asc()])
    .all()
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return db.orm.public.Category.select("name", "slug", "order", "icon").where({ slug }).first()
}
