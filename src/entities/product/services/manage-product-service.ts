"use server"

import { z } from "zod"

import { requireAdmin } from "@/src/entities/admin/services/session-service"
import type { UpdateProductState } from "@/src/entities/product/domain"
import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import * as repository from "../repository/manage-product"
import { parseCreateProductForm, productFormErrors } from "./product-form-data"
import {
  deleteProductImage,
  deleteUploadedProductImages,
  ProductImageStorageError,
  type UploadedProductImage,
} from "./product-image-storage"
import { uploadVariantMedia, validateVariantMedia } from "./product-variant-media"

export async function createProductAction(
  _state: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin()
  const parsed = parseCreateProductForm(formData)
  if (!parsed.success) return productFormErrors(parsed.error)

  const mediaDrafts = validateVariantMedia(formData, parsed.data.variants)
  if (Object.keys(mediaDrafts.errors).length) return { variantErrors: mediaDrafts.errors }

  const uploads: UploadedProductImage[] = []
  try {
    const uploaded = await uploadVariantMedia(mediaDrafts.drafts, uploads)
    await repository.withProductTransaction(async (transaction) => {
      const { category, duplicate } = await transaction.getProductCreateContext(parsed.data)
      if (!category) throw new ProductFormError({ categoryId: ["Выбранная категория не найдена."] })
      if (duplicate) throw new ProductFormError({ slug: ["Товар с таким слагом уже существует."] })

      await transaction.createProduct({
        ...parsed.data,
        variants: parsed.data.variants.map((variant, index) => ({
          ...variant,
          ...uploaded.media[index],
        })),
      })
    })
  } catch (error) {
    await cleanupUploadedImages(uploads, "создания")
    if (error instanceof ProductFormError) return { errors: error.errors }
    if (error instanceof ProductImageStorageError) return { message: error.message }
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
  if (!z.number().int().positive().safeParse(id).success) {
    return { success: false, error: "Некорректный номер товара." }
  }
  try {
    const orderItem = await repository.getProductOrderItem(id)
    if (orderItem) {
      return {
        success: false,
        error: "Товар используется в заказах и не может быть удалён. Его можно скрыть из каталога.",
      }
    }
    const media = await repository.getProductMedia(id)
    if (!media) return { success: false, error: "Товар не найден. Обновите страницу." }

    const imageUrls = new Set(
      media.variants.flatMap((variant) => [variant.avatar, ...variant.images]),
    )
    try {
      for (const imageUrl of imageUrls) {
        await deleteProductImage(imageUrl)
      }
    } catch (error) {
      console.error("Не удалось удалить изображения товара перед удалением записи", error)
      return {
        success: false,
        error:
          "Не удалось удалить все изображения из хранилища. Запись товара сохранена. Повторите удаление.",
      }
    }
    await repository.deleteProduct(id)
  } catch (error) {
    console.error("Не удалось удалить товар", error)
    return {
      success: false,
      error:
        "Не удалось удалить товар. Возможно, он уже используется в заказе. Попробуйте скрыть его из каталога.",
    }
  }
  revalidateCatalog()
  return { success: true }
}

async function cleanupUploadedImages(images: UploadedProductImage[], operation: string) {
  if (!images.length) return
  try {
    await deleteUploadedProductImages(images)
  } catch (cleanupError) {
    console.error(`Не удалось удалить изображения товара после ошибки ${operation}`, cleanupError)
  }
}
