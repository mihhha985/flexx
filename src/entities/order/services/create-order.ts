import "server-only"

import { OrderError, type CreateOrderInput } from "../domain"
import type { OrderTransactionRepository } from "../repository/create-order"

export async function createOrder(
  data: CreateOrderInput,
  repository: OrderTransactionRepository,
): Promise<string> {
  const variants = await repository.getVariants(data.items.map((item) => item.variantId))
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]))
  const quantitiesBySizeId = new Map<number, number>()
  const selectedSizes = new Map<number, (typeof variants)[number]["sizes"][number]>()
  const items = []
  let totalCents = 0

  for (const item of [...data.items].sort(
    (left, right) => left.variantId - right.variantId || left.size - right.size,
  )) {
    const variant = variantsById.get(item.variantId)
    if (!variant?.isActive || !variant.product.isActive) {
      throw new OrderError("Один из товаров больше недоступен. Обновите корзину.")
    }

    const size = variant.sizes.find((candidate) => candidate.size === item.size)
    if (!size) {
      throw new OrderError(
        `Размер ${item.size} для товара «${variant.product.name}» больше недоступен.`,
      )
    }

    const reservedQuantity = (quantitiesBySizeId.get(size.id) ?? 0) + item.quantity
    if (size.stock < reservedQuantity) {
      throw new OrderError(
        `Недостаточно товара «${variant.product.name}», цвет ${variant.colorName}, размер ${item.size}. Доступно: ${size.stock} шт.`,
      )
    }
    quantitiesBySizeId.set(size.id, reservedQuantity)
    selectedSizes.set(size.id, size)

    const priceCents = Math.round(variant.price * 100)
    totalCents += priceCents * item.quantity
    if (priceCents < 0 || !Number.isSafeInteger(priceCents) || !Number.isSafeInteger(totalCents)) {
      throw new OrderError("Не удалось рассчитать стоимость заказа. Свяжитесь с нами.")
    }

    items.push({
      productId: variant.product.id,
      variantId: variant.id,
      productName: variant.product.name,
      colorName: variant.colorName,
      colorSlug: variant.colorSlug,
      size: item.size,
      unitPrice: priceCents / 100,
      quantity: item.quantity,
    })
  }

  for (const variant of variants.sort((left, right) => left.id - right.id)) {
    if ((await repository.reserveVariant(variant)) !== 1) {
      throw new OrderError("Доступность или цена товара изменились. Повторите оформление заказа.")
    }
  }
  for (const [sizeId, quantity] of [...quantitiesBySizeId].sort(
    ([leftId], [rightId]) => leftId - rightId,
  )) {
    const size = selectedSizes.get(sizeId)
    if (!size || (await repository.reserveSize(size, quantity)) !== 1) {
      throw new OrderError("Остаток товара изменился. Повторите оформление заказа.")
    }
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
