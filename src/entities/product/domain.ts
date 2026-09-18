import { z } from "zod"

import type { Category } from "@/src/entities/category/domain"

export type ProductVariantSize = {
  id: number
  size: number
  stock: number
}

export type ProductVariant = {
  id: number
  colorName: string
  colorSlug: string
  colorHex: string
  price: number
  avatar: string
  images: readonly string[]
  isActive: boolean
  order: number
  sizes: readonly ProductVariantSize[]
}

// Catalog, cart and favorites use a flattened product + selected color variant DTO.
export type Product = {
  id: number
  variantId: number
  name: string
  slug: string
  description?: string
  colorName: string
  colorSlug: string
  colorHex: string
  price: number
  avatar: string
  images: readonly string[]
  stock: number
  isActive: boolean
}

export type ProductWithCategory = {
  id: number
  name: string
  slug: string
  description: string
  country: string
  isActive: boolean
  category: Category
  variants: readonly ProductVariant[]
}

export const productSizes = Array.from({ length: 14 }, (_, index) => index + 35)
export const MAX_PRODUCT_IMAGES = 10
export const MAX_PRODUCT_VARIANTS = 12

const requiredNumber = (message: string) =>
  z
    .union([z.string(), z.number()])
    .refine((value) => String(value).trim().length > 0, message)
    .transform(Number)

const optionalId = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  requiredNumber("Некорректный вариант").pipe(z.number().int().positive()).optional(),
)

const productSizeSchema = z.object({
  size: requiredNumber("Укажите размер").pipe(
    z
      .number()
      .int("Размер должен быть целым числом")
      .min(35, "Размер должен быть не меньше 35")
      .max(48, "Размер должен быть не больше 48"),
  ),
  stock: requiredNumber("Укажите остаток").pipe(
    z
      .number()
      .int("Остаток должен быть целым числом")
      .min(0, "Остаток не может быть отрицательным")
      .max(2147483647, "Остаток слишком большой"),
  ),
})

const productVariantSchema = z.object({
  id: optionalId,
  colorName: z.string().trim().min(1, "Укажите название цвета").max(100),
  colorSlug: z
    .string()
    .trim()
    .min(1, "Укажите слаг цвета")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Слаг цвета может содержать строчные латинские буквы, цифры и дефисы",
    ),
  colorHex: z
    .string()
    .trim()
    .regex(/^#[0-9a-f]{6}$/i, "Укажите цвет в формате #000000")
    .transform((value) => value.toUpperCase()),
  price: requiredNumber("Укажите цену").pipe(
    z
      .number()
      .finite("Укажите корректную цену")
      .min(0, "Цена не может быть отрицательной")
      .max(999999999.99, "Цена слишком большая"),
  ),
  order: requiredNumber("Не удалось определить порядок варианта").pipe(
    z
      .number()
      .int()
      .min(0)
      .max(MAX_PRODUCT_VARIANTS - 1),
  ),
  isActive: z.boolean(),
  sizes: z
    .array(productSizeSchema)
    .min(1, "Добавьте хотя бы один размер")
    .refine(
      (sizes) => new Set(sizes.map((item) => item.size)).size === sizes.length,
      "Размеры не должны повторяться",
    ),
})

const productFieldsSchema = z.object({
  name: z.string().trim().min(1, "Укажите название").max(200, "Название слишком длинное"),
  slug: z
    .string()
    .trim()
    .min(1, "Укажите слаг")
    .max(200, "Слаг слишком длинный")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Слаг может содержать строчные латинские буквы, цифры и дефисы",
    ),
  categoryId: requiredNumber("Выберите категорию").pipe(z.number().int().positive()),
  country: z.string().trim().min(1, "Укажите страну").max(200, "Название страны слишком длинное"),
  description: z.string().trim().min(1, "Добавьте описание").max(10000, "Описание слишком длинное"),
  variants: z
    .array(productVariantSchema)
    .min(1, "Добавьте хотя бы один цвет")
    .max(MAX_PRODUCT_VARIANTS),
})

function validateVariants(data: z.infer<typeof productFieldsSchema>, context: z.RefinementCtx) {
  const primaryVariants = data.variants.filter((variant) => variant.order === 0)
  if (primaryVariants.length !== 1) {
    context.addIssue({
      code: "custom",
      path: ["variants"],
      message: "Выберите один основной цвет",
    })
  } else if (!primaryVariants[0].isActive) {
    context.addIssue({
      code: "custom",
      path: ["variants", data.variants.indexOf(primaryVariants[0]), "isActive"],
      message: "Основной цвет должен быть активен",
    })
  }

  for (const [field, label] of [
    ["colorSlug", "Слаги цветов"],
    ["order", "Порядок цветов"],
  ] as const) {
    const values = data.variants.map((variant) => variant[field])
    if (new Set(values).size !== values.length) {
      context.addIssue({
        code: "custom",
        path: ["variants"],
        message: `${label} не должны повторяться`,
      })
    }
  }
}

export const createProductFormSchema = productFieldsSchema.superRefine(validateVariants)

export const updateProductFormSchema = productFieldsSchema
  .extend({
    id: requiredNumber("Не удалось определить товар").pipe(z.number().int().positive()),
  })
  .superRefine(validateVariants)

const productImageUrlSchema = z
  .string()
  .trim()
  .url("Укажите корректную ссылку на изображение")
  .max(2048, "Ссылка на изображение слишком длинная")

export const productImagesSchema = z
  .array(productImageUrlSchema)
  .max(MAX_PRODUCT_IMAGES, `Можно добавить не больше ${MAX_PRODUCT_IMAGES} изображений`)
  .refine((images) => new Set(images).size === images.length, "Изображения не должны повторяться")

export type ProductFormInput = z.infer<typeof createProductFormSchema>
export type ProductVariantInput = ProductFormInput["variants"][number]
export type ProductVariantMedia = { avatar: string; images: string[] }
export type CreateProductInput = ProductFormInput & {
  variants: Array<ProductVariantInput & ProductVariantMedia>
}
export type UpdateProductInput = Omit<CreateProductInput, "variants"> & {
  id: number
  variants: Array<ProductVariantInput & ProductVariantMedia>
}

type ProductFieldErrors = {
  name?: string[]
  slug?: string[]
  categoryId?: string[]
  country?: string[]
  description?: string[]
  variants?: string[]
}

export type ProductVariantFieldErrors = {
  colorName?: string[]
  colorSlug?: string[]
  colorHex?: string[]
  price?: string[]
  isActive?: string[]
  sizes?: string[]
  avatar?: string[]
  images?: string[]
}

export type UpdateProductState = {
  success?: boolean
  message?: string
  errors?: ProductFieldErrors
  variantErrors?: Record<number, ProductVariantFieldErrors>
}

export function getVariantStock(variant: Pick<ProductVariant, "sizes">) {
  return variant.sizes.reduce((total, item) => total + item.stock, 0)
}
