"use server"

import { requireAdmin } from "@/src/entities/admin/services/session-service"
import type { UpdateProductState } from "@/src/entities/product/domain"
import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import * as repository from "../repository/manage-product"
import { parseUpdateProductForm, productFormErrors } from "./product-form-data"
import {
  deleteProductImage,
  deleteUploadedProductImages,
  ProductImageStorageError,
  type UploadedProductImage,
} from "./product-image-storage"
import { uploadVariantMedia, validateVariantMedia } from "./product-variant-media"

export async function updateProductAction(
  _state: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin()
  const parsed = parseUpdateProductForm(formData)
  if (!parsed.success) return productFormErrors(parsed.error)

  const currentMedia = await repository.getProductMedia(parsed.data.id)
  if (!currentMedia) return { message: "Товар не найден. Обновите страницу." }

  const mediaDrafts = validateVariantMedia(formData, parsed.data.variants, currentMedia.variants)
  if (Object.keys(mediaDrafts.errors).length) return { variantErrors: mediaDrafts.errors }

  const retainedVariantIds = new Set(
    parsed.data.variants.flatMap((variant) => (variant.id === undefined ? [] : [variant.id])),
  )
  const removedVariantImages = currentMedia.variants
    .filter((variant) => !retainedVariantIds.has(variant.id))
    .flatMap((variant) => [variant.avatar, ...variant.images])

  const uploads: UploadedProductImage[] = []
  let imagesToDelete: string[] = []
  try {
    const uploaded = await uploadVariantMedia(mediaDrafts.drafts, uploads)
    imagesToDelete = [...uploaded.removedImages, ...removedVariantImages]

    await repository.withProductTransaction(async (transaction) => {
      const { product, category, duplicate } = await transaction.getProductEditContext(parsed.data)
      if (!product) throw new ProductFormError({ message: "Товар не найден. Обновите страницу." })
      if (!category) {
        throw new ProductFormError({ errors: { categoryId: ["Категория не найдена."] } })
      }
      if (duplicate && duplicate.id !== parsed.data.id) {
        throw new ProductFormError({ errors: { slug: ["Товар с таким слагом уже существует."] } })
      }

      const updated = await transaction.updateProduct({
        ...parsed.data,
        variants: parsed.data.variants.map((variant, index) => ({
          ...variant,
          ...uploaded.media[index],
        })),
      })
      if (!updated) throw new ProductFormError({ message: "Товар изменился. Обновите страницу." })
    })
  } catch (error) {
    await cleanupUploadedImages(uploads)
    if (error instanceof ProductFormError) return error.state
    if (error instanceof ProductImageStorageError) return { message: error.message }
    console.error("Не удалось обновить товар", error)
    return { message: "Не удалось сохранить изменения. Попробуйте ещё раз позже." }
  }

  for (const imageUrl of imagesToDelete) {
    try {
      await deleteProductImage(imageUrl)
    } catch (error) {
      console.error("Не удалось удалить прежнее изображение товара", error)
    }
  }

  revalidateCatalog()
  return { success: true, message: "Изменения сохранены." }
}

class ProductFormError extends Error {
  constructor(readonly state: UpdateProductState) {
    super()
  }
}

async function cleanupUploadedImages(images: UploadedProductImage[]) {
  if (!images.length) return
  try {
    await deleteUploadedProductImages(images)
  } catch (cleanupError) {
    console.error("Не удалось удалить изображения товара после ошибки обновления", cleanupError)
  }
}
