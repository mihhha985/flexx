"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/src/entities/admin/services/session-service"
import * as repository from "../repository/manage-order"
import { orderStatuses, type OrderStatus } from "@/src/entities/order/status"

const idSchema = z.number().int().positive()
const statusSchema = z.enum(Object.keys(orderStatuses) as [OrderStatus, ...OrderStatus[]])

export async function updateOrderStatus(id: number, status: unknown) {
  await requireAdmin()
  const parsed = statusSchema.safeParse(status)
  if (!idSchema.safeParse(id).success || !parsed.success) {
    return { success: false, error: "Некорректные данные заявки." }
  }
  try {
    const order = await repository.updateOrderStatus(id, parsed.data)
    if (!order) return { success: false, error: "Заявка не найдена." }
  } catch (error) {
    console.error("Не удалось изменить статус заявки", error)
    return { success: false, error: "Не удалось изменить статус. Попробуйте ещё раз." }
  }
  try {
    revalidatePath("/panel/orders")
  } catch (error) {
    console.error("Не удалось обновить список заявок", error)
  }
  return { success: true }
}

export async function deleteOrder(id: number) {
  await requireAdmin()
  if (!idSchema.safeParse(id).success)
    return { success: false, error: "Некорректный номер заявки." }
  try {
    // OrderItem rows are removed by the database's ON DELETE CASCADE.
    await repository.deleteOrder(id)
  } catch (error) {
    console.error("Не удалось удалить заявку", error)
    return { success: false, error: "Не удалось удалить заявку. Попробуйте ещё раз." }
  }
  try {
    revalidatePath("/panel/orders")
  } catch (error) {
    console.error("Не удалось обновить список заявок", error)
  }
  return { success: true }
}
