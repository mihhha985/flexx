"use server"

import { revalidatePath } from "next/cache"
import { orderSchema, OrderError, type CreateOrderResult } from "../domain"
import { createOrder } from "../reposytory/createOrder"

export async function createValidatedOrder(data: unknown): Promise<CreateOrderResult> {
  const validated = orderSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Проверьте данные заказа" }
  }

  let publicId: string
  try {
    publicId = await createOrder(validated.data)
  } catch (error) {
    if (error instanceof OrderError) {
      return { success: false, error: error.message }
    }
    console.error("Не удалось сохранить заказ", error)
    return { success: false, error: "Не удалось оформить заказ. Попробуйте ещё раз позже." }
  }

  // Cache failures must not report a committed order as a failed checkout.
  try {
    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Не удалось обновить каталог после заказа", error)
  }
  return { success: true, publicId }
}
