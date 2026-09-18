import {
  MAX_PRODUCT_IMAGES,
  productImagesSchema,
  type ProductFormInput,
  type ProductVariantFieldErrors,
  type ProductVariantMedia,
} from "../domain"
import {
  getProductImageFile,
  getProductImageFiles,
  uploadProductImage,
  type UploadedProductImage,
} from "./product-image-storage"

type ExistingVariantMedia = {
  id: number
  avatar: string
  images: readonly string[]
}

type VariantMediaDraft = {
  existing?: ExistingVariantMedia
  avatarFile: File | null
  imageFiles: File[]
  retainedImages: string[]
}

export function validateVariantMedia(
  formData: FormData,
  variants: ProductFormInput["variants"],
  existingVariants: readonly ExistingVariantMedia[] = [],
) {
  const existingById = new Map(existingVariants.map((variant) => [variant.id, variant]))
  const drafts: VariantMediaDraft[] = []
  const errors: Record<number, ProductVariantFieldErrors> = {}

  for (const [index, variant] of variants.entries()) {
    const variantErrors: ProductVariantFieldErrors = {}
    const existing = variant.id === undefined ? undefined : existingById.get(variant.id)
    if (variant.id !== undefined && !existing) {
      variantErrors.images = ["Вариант устарел. Обновите страницу и попробуйте снова."]
    }

    const avatar = getProductImageFile(formData.get(`variants.${index}.avatar`))
    if (avatar.error) variantErrors.avatar = [avatar.error]
    else if (!avatar.file && !existing)
      variantErrors.avatar = ["Добавьте главное изображение цвета."]

    const images = getProductImageFiles(formData.getAll(`variants.${index}.images`))
    if (images.error) variantErrors.images = [images.error]

    const retainedResult = productImagesSchema.safeParse(
      formData.getAll(`variants.${index}.retainedImage`),
    )
    if (!retainedResult.success) {
      variantErrors.images = retainedResult.error.issues.map((issue) => issue.message)
    }

    const retainedImages = retainedResult.success ? retainedResult.data : []
    if (existing && retainedImages.some((image) => !existing.images.includes(image))) {
      variantErrors.images = ["Список изображений устарел. Обновите страницу и попробуйте снова."]
    }
    if (retainedImages.length + images.files.length > MAX_PRODUCT_IMAGES) {
      variantErrors.images = [`Можно добавить не больше ${MAX_PRODUCT_IMAGES} изображений.`]
    }

    if (Object.keys(variantErrors).length) errors[index] = variantErrors
    drafts.push({
      existing,
      avatarFile: avatar.file ?? null,
      imageFiles: images.files,
      retainedImages,
    })
  }

  return { drafts, errors }
}

export async function uploadVariantMedia(
  drafts: VariantMediaDraft[],
  uploads: UploadedProductImage[],
) {
  const removedImages: string[] = []
  const media: ProductVariantMedia[] = []

  for (const draft of drafts) {
    const avatarUpload = draft.avatarFile ? await uploadProductImage(draft.avatarFile) : null
    if (avatarUpload) uploads.push(avatarUpload)

    const imageUploads: UploadedProductImage[] = []
    for (const file of draft.imageFiles) {
      const upload = await uploadProductImage(file)
      uploads.push(upload)
      imageUploads.push(upload)
    }

    const avatar = avatarUpload?.url ?? draft.existing?.avatar
    if (!avatar) throw new Error("Главное изображение варианта не определено")

    if (avatarUpload && draft.existing) removedImages.push(draft.existing.avatar)
    if (draft.existing) {
      const retained = new Set(draft.retainedImages)
      removedImages.push(...draft.existing.images.filter((image) => !retained.has(image)))
    }

    media.push({
      avatar,
      images: [...draft.retainedImages, ...imageUploads.map((image) => image.url)],
    })
  }

  return { media, removedImages }
}
