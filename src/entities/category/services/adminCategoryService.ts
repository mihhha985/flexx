import "server-only"

import { getAdminCategories } from "../repository/getAdminCategories"

export async function getCategoriesForAdmin() {
  const categories = await getAdminCategories()
  return categories.map(({ products, ...category }) => ({ ...category, productCount: products }))
}

export type AdminCategory = Awaited<ReturnType<typeof getCategoriesForAdmin>>[number]
