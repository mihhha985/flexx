import "server-only"

import { db } from "@/src/prisma/db"

export async function getAdminOrders() {
  return db.orm.public.Order.select(
    "id",
    "publicId",
    "status",
    "customerName",
    "customerEmail",
    "customerPhone",
    "shippingAddress",
    "comment",
    "total",
    "createdAt",
  )
    .include("items", (items) =>
      items
        .select("id", "productName", "colorName", "colorSlug", "size", "unitPrice", "quantity")
        .include("product", (product) => product.select("slug", "isActive")),
    )
    .orderBy([(order) => order.createdAt.desc(), (order) => order.id.desc()])
    .all()
}
