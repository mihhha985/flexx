import "server-only"
import { db } from "@/src/prisma/db"
import type { OrderStatus } from "../status"

export async function updateOrderStatus(id: number, status: OrderStatus) {
  return db.orm.public.Order.where({ id }).select("id").update({ status })
}
export async function deleteOrder(id: number) {
  // The database cascades deletion to OrderItem.
  return db.orm.public.Order.where({ id }).delete()
}
