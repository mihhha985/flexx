"use server"

import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import { z } from "zod"
import { requireAdmin } from "@/src/entities/admin/services/session-service"
import * as repository from "../repository/manage-category"
import { categorySchema, type CategoryFormState } from "@/src/entities/category/admin-domain"

export async function saveCategoryAction(
  _state: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin()
  const rawId = formData.get("id")
  const id = rawId === null ? undefined : Number(rawId)
  if (id !== undefined && !z.number().int().positive().safeParse(id).success)
    return { message: "Некорректный номер категории." }
  const parsed = categorySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }
  try {
    const duplicate = await repository.findCategoryBySlug(parsed.data.slug)
    if (duplicate && duplicate.id !== id)
      return { errors: { slug: ["Категория с таким слагом уже существует."] } }
    if (id === undefined) {
      await repository.createCategory(parsed.data)
    } else {
      const category = await repository.updateCategory(id, parsed.data)
      if (!category) return { message: "Категория не найдена. Обновите страницу." }
    }
  } catch (error) {
    console.error("Не удалось сохранить категорию", error)
    return { message: "Не удалось сохранить категорию. Проверьте данные и попробуйте ещё раз." }
  }
  revalidateCatalog()
  return {
    success: true,
    message: id === undefined ? "Категория создана." : "Категория обновлена.",
  }
}

export async function deleteCategoryAction(id: number) {
  await requireAdmin()
  if (!z.number().int().positive().safeParse(id).success)
    return { success: false, error: "Некорректный номер категории." }
  try {
    const product = await repository.findCategoryProduct(id)
    if (product)
      return {
        success: false,
        error: "В категории есть товары. Сначала перенесите их в другую категорию или удалите.",
      }
    await repository.deleteCategory(id)
  } catch (error) {
    console.error("Не удалось удалить категорию", error)
    return {
      success: false,
      error:
        "Не удалось удалить категорию. Убедитесь, что в ней нет товаров, и попробуйте ещё раз.",
    }
  }
  revalidateCatalog()
  return { success: true }
}
