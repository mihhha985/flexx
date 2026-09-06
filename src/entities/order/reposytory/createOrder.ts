import "server-only"

import { db } from "@/src/prisma/db"
import { OrderError, type CreateOrderInput } from "../domain"

export async function createOrder(data: CreateOrderInput): Promise<string> {
  return db.transaction(async (tx) => {
    const products = await tx.orm.public.Product
      .select("id", "name", "price", "stock", "isActive")
      .where((product) => product.id.in(data.items.map((item) => item.productId)))
      .all()
    const productsById = new Map(products.map((product) => [product.id, product]))
    const items = []
    let totalCents = 0

    // A stable order avoids deadlocks when two carts contain the same products.
    for (const item of [...data.items].sort((a, b) => a.productId - b.productId)) {
      const product = productsById.get(item.productId)
      if (!product?.isActive) {
        throw new OrderError("Один из товаров больше недоступен. Обновите корзину.")
      }
      if (product.stock < item.quantity) {
        throw new OrderError(`Недостаточно товара «${product.name}». Доступно: ${product.stock} шт.`)
      }

      const priceCents = Math.round(product.price * 100)
      totalCents += priceCents * item.quantity
      if (priceCents < 0 || !Number.isSafeInteger(priceCents) || !Number.isSafeInteger(totalCents)) {
        throw new OrderError("Не удалось рассчитать стоимость заказа. Свяжитесь с нами.")
      }

      // Compare-and-set prevents concurrent orders from selling the same stock.
      const reserved = await tx.orm.public.Product
        .where({ id: product.id, isActive: true, stock: product.stock, price: product.price })
        .updateAndCount({ stock: product.stock - item.quantity })
      if (reserved !== 1) {
        throw new OrderError("Наличие или цена товара изменились. Повторите оформление заказа.")
      }

      items.push({
        productId: product.id,
        productName: product.name,
        unitPrice: priceCents / 100,
        quantity: item.quantity,
      })
    }

    const order = await tx.orm.public.Order.create({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      comment: data.comment || null,
      total: totalCents / 100,
    })
    await tx.orm.public.OrderItem.createAll(items.map((item) => ({ ...item, orderId: order.id })))
    return order.publicId
  })
}
