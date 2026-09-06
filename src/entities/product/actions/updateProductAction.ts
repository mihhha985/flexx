"use server"

import { requireAdmin } from "@/src/entities/admin/services/sessionService"
import { revalidatePath } from "next/cache"
import { ProductUpdateError, updateProductSchema, type UpdateProductState } from "../domain"
import { updateProduct } from "../repositiry/updateProduct"

export async function updateProductAction(_state: UpdateProductState, formData: FormData): Promise<UpdateProductState> {
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
    await updateProduct(result.data)
  } catch (error) {
    if (error instanceof ProductUpdateError) {
      return { message: error.message }
    }
    console.error("Не удалось обновить товар", error)
    return { message: "Не удалось сохранить изменения. Попробуйте ещё раз позже." }
  }

  try {
    revalidatePath("/panel/products")
    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Не удалось обновить страницы после редактирования товара", error)
  }

  return { success: true, message: "Изменения сохранены." }
}
