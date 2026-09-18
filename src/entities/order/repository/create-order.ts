import "server-only"

import { db } from "@/src/prisma/db"
import type { CreateOrderInput } from "../domain"

type OrderItemInput = {
  productId: number
  variantId: number
  productName: string
  colorName: string
  colorSlug: string
  size: number
  unitPrice: number
  quantity: number
}

type VariantSnapshot = { id: number; price: number; order: number }
type SizeSnapshot = { id: number; stock: number }

function transactionRepository(tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) {
  return {
    getVariants: async (ids: number[]) =>
      tx.orm.public.ProductVariant.select(
        "id",
        "colorName",
        "colorSlug",
        "price",
        "order",
        "isActive",
      )
        .where((variant) => variant.id.in(ids))
        .include("product", (product) => product.select("id", "name", "isActive"))
        .include("sizes", (sizes) => sizes.select("id", "size", "stock"))
        .all(),
    reserveVariant: (variant: VariantSnapshot) =>
      tx.orm.public.ProductVariant.where({
        id: variant.id,
        isActive: true,
        price: variant.price,
      }).updateAndCount({ order: variant.order }),
    reserveSize: (size: SizeSnapshot, quantity: number) =>
      tx.orm.public.ProductVariantSize.where({ id: size.id, stock: size.stock }).updateAndCount({
        stock: size.stock - quantity,
      }),
    insertOrder: (data: Omit<CreateOrderInput, "items"> & { total: number }) =>
      tx.orm.public.Order.create(data),
    insertItems: async (orderId: number, items: OrderItemInput[]) =>
      tx.orm.public.OrderItem.createAll(items.map((item) => ({ ...item, orderId }))),
  }
}

export type OrderTransactionRepository = ReturnType<typeof transactionRepository>

export async function withOrderTransaction<T>(
  operation: (repository: OrderTransactionRepository) => Promise<T>,
): Promise<T> {
  return db.transaction((tx) => operation(transactionRepository(tx)))
}
