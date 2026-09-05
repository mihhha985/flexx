import { z } from "zod"

export const orderSchema = z.object({
  customerName: z.string().trim().min(1, "Укажите имя").max(200),
  customerEmail: z.string().trim().email("Укажите корректную почту").max(254),
  customerPhone: z.string().trim().max(30).regex(
    /^\+?[\d\s()-]+$/,
    "Укажите корректный телефон",
  ).refine((value) => {
    const digits = value.replace(/\D/g, "").length
    return digits >= 7 && digits <= 15
  }, "Укажите корректный телефон"),
  shippingAddress: z.string().trim().min(1, "Укажите адрес доставки").max(1000),
  comment: z.string().trim().max(2000).optional(),
  items: z.array(z.object({
    productId: z.number().int().positive().max(2147483647),
    quantity: z.number().int().positive().max(2147483647),
  })).min(1, "Корзина пуста").max(100).refine(
    (items) => new Set(items.map((item) => item.productId)).size === items.length,
    "Товар не должен повторяться в заказе",
  ),
})

export type CreateOrderInput = z.infer<typeof orderSchema>

export type CreateOrderResult =
  | { success: true; publicId: string }
  | { success: false; error: string }

export class OrderError extends Error {}
