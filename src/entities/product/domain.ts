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
}

const requiredNumber = (message: string) => z.string().trim().min(1, message).transform(Number)

export const updateProductSchema = z.object({
  id: requiredNumber("Не удалось определить товар").pipe(z.number().int().positive()),
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

export const createProductSchema = updateProductSchema.omit({ id: true })

export type UpdateProductInput = z.infer<typeof updateProductSchema>

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
  }
}
