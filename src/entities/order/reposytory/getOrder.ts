import "server-only"

import { connectDatabase, db } from "@/src/prisma/db"

export async function getOrderConfirmation(publicId: string) {
  await connectDatabase()
  return db.orm.public.Order.select("publicId")
    .where({ publicId }).first()
}
