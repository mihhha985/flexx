import "server-only"
import { requireAdmin } from "@/src/entities/admin/services/session-service"

import { getAdminProducts } from "@/src/entities/product/repository/get-admin-products"

export async function getProductsForAdmin() {
  await requireAdmin()
  try {
    const products = await getAdminProducts()
    return products.map(({ category, ...product }) => ({ ...product, categoryName: category.name }))
  } catch (error) {
    console.error("Не удалось загрузить список product", error)
    throw error
  }
}

export type AdminProduct = Awaited<ReturnType<typeof getProductsForAdmin>>[number]
