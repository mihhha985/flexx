"use server"

import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import { z } from "zod"
import { requireAdmin } from "@/src/entities/admin/services/session-service"
import * as repository from "../repository/manage-product"
import {
  createProductFormSchema,
  MAX_PRODUCT_IMAGES,
  type UpdateProductState,
} from "@/src/entities/product/domain"
import {
  deleteProductImage,
  deleteUploadedProductImages,
  getProductImageFile,
  getProductImageFiles,
  ProductImageStorageError,
  uploadProductImage,
  type UploadedProductImage,
} from "./product-image-storage"

export async function createProductAction(
  _state: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin()
  const parsed = createProductFormSchema.safeParse({
    ...Object.fromEntries(formData),
    size: formData.getAll("size"),
  })
  const errors: NonNullable<UpdateProductState["errors"]> = parsed.success
    ? {}
    : parsed.error.flatten().fieldErrors

  const { file: avatarFile, error: avatarError } = getProductImageFile(formData.get("avatar"))
  if (avatarError) errors.avatar = [avatarError]
  else if (!avatarFile) errors.avatar = ["Добавьте главное изображение товара."]

  const { files: imageFiles, error: imagesError } = getProductImageFiles(formData.getAll("images"))
  if (imagesError) errors.images = [imagesError]
  else if (imageFiles.length > MAX_PRODUCT_IMAGES)
    errors.images = [`Можно добавить не больше ${MAX_PRODUCT_IMAGES} изображений.`]

  if (
    !parsed.success ||
    !avatarFile ||
    avatarError ||
    imagesError ||
    imageFiles.length > MAX_PRODUCT_IMAGES
  )
    return { errors }

  const uploads: UploadedProductImage[] = []
  let mediaErrorField: "avatar" | "images" = "avatar"
  try {
    await repository.withProductTransaction(async (transaction) => {
      const { category, duplicate } = await transaction.getProductCreateContext(parsed.data)
      if (!category) throw new ProductFormError({ categoryId: ["Выбранная категория не найдена."] })
      if (duplicate) throw new ProductFormError({ slug: ["Товар с таким слагом уже существует."] })

      uploads.push(await uploadProductImage(avatarFile))
      mediaErrorField = "images"
      for (const imageFile of imageFiles) uploads.push(await uploadProductImage(imageFile))

      const product = await transaction.createProduct({
        ...parsed.data,
        avatar: uploads[0].url,
        images: uploads.slice(1).map((image) => image.url),
      })
      await transaction.saveProductDetail(product.id, parsed.data, false)
    })
  } catch (error) {
    await cleanupUploadedImages(uploads, "создания")
    if (error instanceof ProductFormError) return { errors: error.errors }
    if (error instanceof ProductImageStorageError)
      return { errors: { [mediaErrorField]: [error.message] } }
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
        error: "Товар используется в заказах и не может быть удалён. Его можно скрыть из каталога.",
      }
    const media = await repository.getProductMedia(id)
    if (!media) return { success: false, error: "Товар не найден. Обновите страницу." }

    // The foreign key also protects orders created concurrently with this check.
    await repository.deleteProduct(id)
    for (const imageUrl of [media.avatar, ...media.images]) {
      try {
        await deleteProductImage(imageUrl)
      } catch (cleanupError) {
        console.error("Не удалось удалить изображение удалённого товара", cleanupError)
      }
    }
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
