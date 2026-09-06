import "server-only"
import { OrderError, type CreateOrderInput } from "../domain"
import type { OrderTransactionRepository } from "../repository/create-order"

export async function createOrder(
  data: CreateOrderInput,
  repository: OrderTransactionRepository,
): Promise<string> {
  const products = await repository.getProducts(data.items.map((item) => item.productId))
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
    const reserved = await repository.reserveProduct(product, item.quantity)
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

  const order = await repository.insertOrder({
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    shippingAddress: data.shippingAddress,
    comment: data.comment || undefined,
    total: totalCents / 100,
  })
  await repository.insertItems(order.id, items)
  return order.publicId
}
