"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/src/entities/admin/services/sessionService"
import { db } from "@/src/prisma/db"
import { createProductSchema, type UpdateProductState } from "../domain"

function refreshCatalog() {
  try { revalidatePath("/", "layout") } catch (error) {
    console.error("Не удалось обновить каталог", error)
  }
}

export async function createProductAction(_state: UpdateProductState, formData: FormData): Promise<UpdateProductState> {
  await requireAdmin()
  const parsed = createProductSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }
  try {
    const [category, duplicate] = await Promise.all([
      db.orm.public.Category.where({ id: parsed.data.categoryId }).select("id").first(),
      db.orm.public.Product.where({ slug: parsed.data.slug }).select("id").first(),
    ])
    if (!category) return { errors: { categoryId: ["Выбранная категория не найдена."] } }
    if (duplicate) return { errors: { slug: ["Товар с таким слагом уже существует."] } }
    await db.orm.public.Product.create({ ...parsed.data, isActive: true })
  } catch (error) {
    console.error("Не удалось создать товар", error)
    return { message: "Не удалось создать товар. Проверьте данные и попробуйте ещё раз." }
  }
  refreshCatalog()
  return { success: true, message: "Товар создан и доступен в каталоге." }
}

export async function setProductActive(id: number, isActive: boolean) {
  await requireAdmin()
  if (!z.number().int().positive().safeParse(id).success || typeof isActive !== "boolean") {
    return { success: false, error: "Некорректные данные товара." }
  }
  try {
    const product = await db.orm.public.Product.where({ id }).select("id").update({ isActive })
    if (!product) return { success: false, error: "Товар не найден. Обновите страницу." }
  } catch (error) {
    console.error("Не удалось изменить видимость товара", error)
    return { success: false, error: "Не удалось изменить статус товара. Попробуйте ещё раз." }
  }
  refreshCatalog()
  return { success: true }
}

export async function deleteProductAction(id: number) {
  await requireAdmin()
  if (!z.number().int().positive().safeParse(id).success) return { success: false, error: "Некорректный номер товара." }
  try {
    const orderItem = await db.orm.public.OrderItem.where({ productId: id }).select("id").first()
    if (orderItem) return { success: false, error: "Товар используется в заявках и не может быть удалён. Его можно скрыть из каталога." }
    // The foreign key also protects orders created concurrently with this check.
    await db.orm.public.Product.where({ id }).delete()
  } catch (error) {
    console.error("Не удалось удалить товар", error)
    return { success: false, error: "Не удалось удалить товар. Возможно, он уже используется в заявке. Попробуйте скрыть его из каталога." }
  }
  refreshCatalog()
  return { success: true }
}
