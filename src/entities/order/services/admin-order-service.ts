import "server-only"
import { requireAdmin } from "@/src/entities/admin/services/session-service"

import { getAdminOrders } from "@/src/entities/order/repository/get-admin-orders"

export async function getOrdersForAdmin() {
  await requireAdmin()
  try {
    return getAdminOrders()
  } catch (error) {
    console.error("Не удалось загрузить список order", error)
    throw error
  }
}

export type AdminOrder = Awaited<ReturnType<typeof getOrdersForAdmin>>[number]
