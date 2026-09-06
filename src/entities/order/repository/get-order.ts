import "server-only"

import { db } from "@/src/prisma/db"

export async function getOrderConfirmation(publicId: string) {
  return db.orm.public.Order.select("publicId").where({ publicId }).first()
}
