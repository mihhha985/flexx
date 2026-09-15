import "server-only"
import { requireAdmin } from "@/src/entities/admin/services/session-service"

import { getAdminCategories } from "@/src/entities/category/repository/get-admin-categories"

export async function getCategoriesForAdmin() {
  await requireAdmin()
  try {
    const categories = await getAdminCategories()
    return categories.map(({ products, ...category }) => ({ ...category, productCount: products }))
  } catch (error) {
    console.error("Не удалось загрузить список категорий", error)
    throw error
  }
}

export type AdminCategory = Awaited<ReturnType<typeof getCategoriesForAdmin>>[number]
