"use server"

import { requireAdmin } from "@/src/entities/admin/services/session-service"
import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import { updateProductSchema, type UpdateProductState } from "@/src/entities/product/domain"
import * as repository from "../repository/manage-product"

export async function updateProductAction(
  _state: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin()
  const result = updateProductSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    const { product, category, duplicate } = await repository.getProductEditContext(
      result.data.id,
      result.data.categoryId,
      result.data.slug,
    )
    if (!product) return { message: "Товар не найден." }
    if (!category) return { errors: { categoryId: ["Категория не найдена."] } }
    if (duplicate && duplicate.id !== result.data.id)
      return { errors: { slug: ["Товар с таким слагом уже существует."] } }
    const updated = await repository.updateProduct(result.data)
    if (!updated) return { message: "Товар не найден. Обновите страницу." }
  } catch (error) {
    console.error("Не удалось обновить товар", error)
    return { message: "Не удалось сохранить изменения. Попробуйте ещё раз позже." }
  }

  revalidateCatalog()

  return { success: true, message: "Изменения сохранены." }
}
