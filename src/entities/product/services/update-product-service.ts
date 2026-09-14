"use server"

import { requireAdmin } from "@/src/entities/admin/services/session-service"
import { revalidateCatalog } from "@/src/shared/lib/revalidate-catalog"
import {
  MAX_PRODUCT_IMAGES,
  productImagesSchema,
  updateProductFormSchema,
  type UpdateProductState,
} from "@/src/entities/product/domain"
import * as repository from "../repository/manage-product"
import {
  deleteProductImage,
  deleteUploadedProductImages,
  getProductImageFile,
  getProductImageFiles,
  ProductImageStorageError,
  uploadProductImage,
  type UploadedProductImage,
} from "./product-image-storage"

export async function updateProductAction(
  _state: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  await requireAdmin()
  const { file: avatarFile, error: avatarError } = getProductImageFile(formData.get("avatar"))
  if (avatarError) return { errors: { avatar: [avatarError] } }

  const { files: imageFiles, error: imagesError } = getProductImageFiles(formData.getAll("images"))
  if (imagesError) return { errors: { images: [imagesError] } }

  const retainedImagesResult = productImagesSchema.safeParse(formData.getAll("retainedImage"))
  if (!retainedImagesResult.success)
    return { errors: { images: retainedImagesResult.error.issues.map((issue) => issue.message) } }
  if (retainedImagesResult.data.length + imageFiles.length > MAX_PRODUCT_IMAGES)
    return { errors: { images: [`Можно добавить не больше ${MAX_PRODUCT_IMAGES} изображений.`] } }

  const result = updateProductFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
    color: formData.get("color"),
    size: formData.getAll("size"),
    country: formData.get("country"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const uploads: UploadedProductImage[] = []
  let previousAvatar: string | null = null
  let removedImages: string[] = []
  let mediaErrorField: "avatar" | "images" = "avatar"
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

      const retainedImageSet = new Set(retainedImagesResult.data)
      if (retainedImagesResult.data.some((image) => !product.images.includes(image)))
        throw new ProductFormError({
          errors: { images: ["Список изображений устарел. Обновите страницу и попробуйте снова."] },
        })

      if (avatarFile) uploads.push(await uploadProductImage(avatarFile))
      mediaErrorField = "images"
      for (const imageFile of imageFiles) uploads.push(await uploadProductImage(imageFile))

      const retainedImages = product.images.filter((image) => retainedImageSet.has(image))
      const uploadedImages = uploads.slice(avatarFile ? 1 : 0).map((image) => image.url)
      previousAvatar = avatarFile ? product.avatar : null
      removedImages = product.images.filter((image) => !retainedImageSet.has(image))

      const updated = await transaction.updateProduct({
        ...result.data,
        avatar: avatarFile ? uploads[0].url : product.avatar,
        images: [...retainedImages, ...uploadedImages],
      })
      if (!updated) throw new ProductFormError({ message: "Товар не найден. Обновите страницу." })
      await transaction.saveProductDetail(result.data.id, result.data, Boolean(detail))
    })
  } catch (error) {
    await cleanupUploadedImages(uploads)
    if (error instanceof ProductFormError) return error.state
    if (error instanceof ProductImageStorageError)
      return { errors: { [mediaErrorField]: [error.message] } }
    console.error("Не удалось обновить товар", error)
    return { message: "Не удалось сохранить изменения. Попробуйте ещё раз позже." }
  }

  for (const imageUrl of [previousAvatar, ...removedImages]) {
    if (!imageUrl) continue
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
