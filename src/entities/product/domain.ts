import { z } from "zod"

import type { Category } from "@/src/entities/category/domain"

export type Product = {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  imageUrl: string | null
  stock: number
  isActive: boolean
}

export type ProductWithCategory = Product & {
  category: Category
  detail: ProductDetail | null
}

export type ProductDetail = {
  color: (typeof productColorValues)[number]
  size: readonly number[]
  country: string
}
const requiredNumber = (message: string) => z.string().trim().min(1, message).transform(Number)

const productColorValues = [
  "#FFFFFF",
  "#000000",
  "#FF0000",
  "#0000FF",
  "#008000",
  "#808080",
] as const

export const productColors = [
  { value: productColorValues[0], label: "Белый" },
  { value: productColorValues[1], label: "Чёрный" },
  { value: productColorValues[2], label: "Красный" },
  { value: productColorValues[3], label: "Синий" },
  { value: productColorValues[4], label: "Зелёный" },
  { value: productColorValues[5], label: "Серый" },
] as const

export const productSizes = Array.from({ length: 14 }, (_, index) => index + 35)

const productColorSchema = z.enum(productColorValues, "Выберите цвет из списка")

const productSizeSchema = requiredNumber("Выберите размер").pipe(
  z
    .number()
    .int("Размер должен быть целым числом")
    .min(35, "Размер должен быть не меньше 35")
    .max(48, "Размер должен быть не больше 48"),
)

export const productDetailSchema = z.object({
  color: productColorSchema,
  size: z.preprocess(
    (value) => (Array.isArray(value) ? value : [value]),
    z
      .array(productSizeSchema)
      .min(1, "Выберите хотя бы один размер")
      .refine((sizes) => new Set(sizes).size === sizes.length, "Размеры не должны повторяться"),
  ),
  country: z.string().trim().min(1, "Укажите страну").max(200, "Название страны слишком длинное"),
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
  price: requiredNumber("Укажите цену").pipe(
    z
      .number()
      .finite()
      .min(0, "Цена не может быть отрицательной")
      .max(999999999.99, "Цена слишком большая"),
  ),
  stock: requiredNumber("Укажите остаток").pipe(
    z
      .number()
      .int("Остаток должен быть целым числом")
      .min(0, "Остаток не может быть отрицательным")
      .max(2147483647, "Остаток слишком большой"),
  ),
  description: z.string().trim().min(1, "Добавьте описание").max(10000, "Описание слишком длинное"),
  imageUrl: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z
      .string()
      .trim()
      .url("Укажите корректную ссылку на изображение")
      .max(2048, "Ссылка слишком длинная")
      .nullable(),
  ),
})

export const createProductSchema = productFieldsSchema.merge(productDetailSchema)

export const updateProductSchema = createProductSchema.extend({
  id: requiredNumber("Не удалось определить товар").pipe(z.number().int().positive()),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type ProductDetailInput = z.infer<typeof productDetailSchema>

export type UpdateProductState = {
  success?: boolean
  message?: string
  errors?: {
    name?: string[]
    slug?: string[]
    categoryId?: string[]
    price?: string[]
    stock?: string[]
    description?: string[]
    imageUrl?: string[]
    image?: string[]
    color?: string[]
    size?: string[]
    country?: string[]
  }
}
