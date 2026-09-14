import "server-only"
import { requireAdmin } from "@/src/entities/admin/services/session-service"

import {
  getAdminProduct,
  getAdminProducts,
} from "@/src/entities/product/repository/get-admin-products"

export async function getProductsForAdmin() {
  await requireAdmin()
  try {
    return await getAdminProducts()
  } catch (error) {
    console.error("Не удалось загрузить список product", error)
    throw error
  }
}

export async function getProductForAdmin(id: number) {
  await requireAdmin()
  try {
    return await getAdminProduct(id)
  } catch (error) {
    console.error("Не удалось загрузить товар для редактирования", { id, error })
    throw error
  }
}

export type AdminProduct = Awaited<ReturnType<typeof getProductsForAdmin>>[number]
