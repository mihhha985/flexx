"use server"

import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import { orderSchema, OrderError, type CreateOrderResult } from "@/src/entities/order/domain"
import { withOrderTransaction } from "../repository/create-order"
import { createOrder } from "./create-order"

export async function createValidatedOrder(data: unknown): Promise<CreateOrderResult> {
  const validated = orderSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message ?? "Проверьте данные заказа",
    }
  }

  let publicId: string
  try {
    publicId = await withOrderTransaction((repository) => createOrder(validated.data, repository))
  } catch (error) {
    if (error instanceof OrderError) {
      return { success: false, error: error.message }
    }
    console.error("Не удалось сохранить заказ", error)
    return { success: false, error: "Не удалось оформить заказ. Попробуйте ещё раз позже." }
  }

  revalidateCatalog()
  return { success: true, publicId }
}
