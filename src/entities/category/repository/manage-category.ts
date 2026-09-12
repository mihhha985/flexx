import "server-only"
import { db } from "@/src/prisma/db"
import type { CategoryInput } from "../admin-domain"

export async function findCategoryBySlug(slug: string) {
  return db.orm.public.Category.where({ slug }).select("id").first()
}
export async function findCategoryByIcon(icon: string) {
  return db.orm.public.Category.where({ icon }).select("id").first()
}
export async function createCategory(data: CategoryInput) {
  return db.orm.public.Category.create(data)
}
export async function updateCategory(id: number, data: CategoryInput) {
  return db.orm.public.Category.where({ id }).select("id").update(data)
}
export async function findCategoryProduct(categoryId: number) {
  return db.orm.public.Product.where({ categoryId }).select("id").first()
}
export async function deleteCategory(id: number) {
  return db.orm.public.Category.where({ id }).delete()
}
