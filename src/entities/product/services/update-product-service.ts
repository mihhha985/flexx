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
    color: formData.get("color"),
    size: formData.getAll("size"),
    country: formData.get("country"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    await repository.withProductTransaction(async (transaction) => {
      const { product, category, duplicate, detail } = await transaction.getProductEditContext(
        result.data,
      )
      if (!product) throw new ProductFormError({ message: "Товар не найден. Обновите страницу." })
      if (!category)
        throw new ProductFormError({ errors: { categoryId: ["Категория не найдена."] } })
      if (duplicate && duplicate.id !== result.data.id)
        throw new ProductFormError({ errors: { slug: ["Товар с таким слагом уже существует."] } })
      const updated = await transaction.updateProduct(result.data)
      if (!updated) throw new ProductFormError({ message: "Товар не найден. Обновите страницу." })
      await transaction.saveProductDetail(result.data.id, result.data, Boolean(detail))
    })
  } catch (error) {
    if (error instanceof ProductFormError) return error.state
    console.error("Не удалось обновить товар", error)
    return { message: "Не удалось сохранить изменения. Попробуйте ещё раз позже." }
  }

  revalidateCatalog()

  return { success: true, message: "Изменения сохранены." }
}

class ProductFormError extends Error {
  constructor(readonly state: UpdateProductState) {
    super()
  }
}
