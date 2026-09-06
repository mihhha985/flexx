import "server-only"

import { getAdminOrders } from "../reposytory/getAdminOrders"

export async function getOrdersForAdmin() {
  return getAdminOrders()
}

export type AdminOrder = Awaited<ReturnType<typeof getOrdersForAdmin>>[number]
