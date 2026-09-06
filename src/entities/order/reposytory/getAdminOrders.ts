import "server-only"

import { db } from "@/src/prisma/db"
import { requireAdmin } from "@/src/entities/admin/services/sessionService"

export async function getAdminOrders() {
  await requireAdmin()
  return db.orm.public.Order
    .select("id", "publicId", "status", "customerName", "customerEmail", "customerPhone", "shippingAddress", "total", "createdAt")
    .include("items", (items) => items.select("id", "productName", "unitPrice", "quantity").include("product", (product) => product.select("slug", "isActive")))
    .orderBy([(order) => order.createdAt.desc(), (order) => order.id.desc()])
    .all()
}
