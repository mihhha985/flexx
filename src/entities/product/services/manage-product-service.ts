"use server"

import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import { z } from "zod"
import { requireAdmin } from "@/src/entities/admin/services/session-service"
import * as repository from "../repository/manage-product"
import { createProductSchema, type UpdateProductState } from "@/src/entities/product/domain"

export async function createProductAction(
  _state: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin()
  const parsed = createProductSchema.safeParse({
    ...Object.fromEntries(formData),
    size: formData.getAll("size"),
  })
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }
  try {
    await repository.withProductTransaction(async (transaction) => {
      const { category, duplicate } = await transaction.getProductCreateContext(parsed.data)
      if (!category) throw new ProductFormError({ categoryId: ["Выбранная категория не найдена."] })
      if (duplicate) throw new ProductFormError({ slug: ["Товар с таким слагом уже существует."] })

      const product = await transaction.createProduct(parsed.data)
      await transaction.saveProductDetail(product.id, parsed.data, false)
    })
  } catch (error) {
    if (error instanceof ProductFormError) return { errors: error.errors }
    console.error("Не удалось создать товар", error)
    return { message: "Не удалось создать товар. Проверьте данные и попробуйте ещё раз." }
  }
  revalidateCatalog()
  return { success: true, message: "Товар создан и доступен в каталоге." }
}

class ProductFormError extends Error {
  constructor(readonly errors: NonNullable<UpdateProductState["errors"]>) {
    super()
  }
}

export async function setProductActive(id: number, isActive: boolean) {
  await requireAdmin()
  if (!z.number().int().positive().safeParse(id).success || typeof isActive !== "boolean") {
    return { success: false, error: "Некорректные данные товара." }
  }
  try {
    const product = await repository.setProductActive(id, isActive)
    if (!product) return { success: false, error: "Товар не найден. Обновите страницу." }
  } catch (error) {
    console.error("Не удалось изменить видимость товара", error)
    return { success: false, error: "Не удалось изменить статус товара. Попробуйте ещё раз." }
  }
  revalidateCatalog()
  return { success: true }
}

export async function deleteProductAction(id: number) {
  await requireAdmin()
  if (!z.number().int().positive().safeParse(id).success)
    return { success: false, error: "Некорректный номер товара." }
  try {
    const orderItem = await repository.getProductOrderItem(id)
    if (orderItem)
      return {
        success: false,
        error: "Товар используется в заявках и не может быть удалён. Его можно скрыть из каталога.",
      }
    // The foreign key also protects orders created concurrently with this check.
    await repository.deleteProduct(id)
  } catch (error) {
    console.error("Не удалось удалить товар", error)
    return {
      success: false,
      error:
        "Не удалось удалить товар. Возможно, он уже используется в заявке. Попробуйте скрыть его из каталога.",
    }
  }
  revalidateCatalog()
  return { success: true }
}
