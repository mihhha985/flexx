import "server-only"
import { db } from "@/src/prisma/db"
import type { CreateOrderInput } from "../domain"

type OrderItemInput = {
  productId: number
  productName: string
  unitPrice: number
  quantity: number
}
type ProductSnapshot = { id: number; stock: number; price: number }

function transactionRepository(tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) {
  return {
    getProducts: async (ids: number[]) =>
      tx.orm.public.Product.select("id", "name", "price", "stock", "isActive")
        .where((product) => product.id.in(ids))
        .all(),
    reserveProduct: (product: ProductSnapshot, quantity: number) =>
      tx.orm.public.Product.where({
        id: product.id,
        isActive: true,
        stock: product.stock,
        price: product.price,
      }).updateAndCount({ stock: product.stock - quantity }),
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
