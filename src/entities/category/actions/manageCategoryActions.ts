"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/src/entities/admin/services/sessionService"
import { db } from "@/src/prisma/db"
import { categorySchema, type CategoryFormState } from "../admin-domain"

function refreshCatalog() {
  try { revalidatePath("/", "layout") } catch (error) {
    console.error("Не удалось обновить категории", error)
  }
}

export async function saveCategoryAction(_state: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin()
  const rawId = formData.get("id")
  const id = rawId === null ? undefined : Number(rawId)
  if (id !== undefined && !z.number().int().positive().safeParse(id).success) return { message: "Некорректный номер категории." }
  const parsed = categorySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }
  try {
    const duplicate = await db.orm.public.Category.where({ slug: parsed.data.slug }).select("id").first()
    if (duplicate && duplicate.id !== id) return { errors: { slug: ["Категория с таким слагом уже существует."] } }
    if (id === undefined) {
      await db.orm.public.Category.create(parsed.data)
    } else {
      const category = await db.orm.public.Category.where({ id }).select("id").update(parsed.data)
      if (!category) return { message: "Категория не найдена. Обновите страницу." }
    }
  } catch (error) {
    console.error("Не удалось сохранить категорию", error)
    return { message: "Не удалось сохранить категорию. Проверьте данные и попробуйте ещё раз." }
  }
  refreshCatalog()
  return { success: true, message: id === undefined ? "Категория создана." : "Категория обновлена." }
}

export async function deleteCategoryAction(id: number) {
  await requireAdmin()
  if (!z.number().int().positive().safeParse(id).success) return { success: false, error: "Некорректный номер категории." }
  try {
    const product = await db.orm.public.Product.where({ categoryId: id }).select("id").first()
    if (product) return { success: false, error: "В категории есть товары. Сначала перенесите их в другую категорию или удалите." }
    await db.orm.public.Category.where({ id }).delete()
  } catch (error) {
    console.error("Не удалось удалить категорию", error)
    return { success: false, error: "Не удалось удалить категорию. Убедитесь, что в ней нет товаров, и попробуйте ещё раз." }
  }
  refreshCatalog()
  return { success: true }
}
