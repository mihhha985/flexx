import "server-only"
import { z } from "zod"
import { getOrderConfirmation as findConfirmation } from "../repository/get-order"

export async function getOrderConfirmation(publicId: string) {
  if (!z.uuid().safeParse(publicId).success) return null
  try {
    return await findConfirmation(publicId)
  } catch (error) {
    console.error("Не удалось загрузить подтверждение заказа", error)
    throw error
  }
}
