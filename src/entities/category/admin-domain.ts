import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Укажите название").max(200, "Название слишком длинное"),
  slug: z
    .string()
    .trim()
    .min(1, "Укажите слаг")
    .max(200, "Слаг слишком длинный")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Используйте строчные латинские буквы, цифры и дефисы"),
  icon: z.string().trim().min(1, "Укажите идентификатор иконки").max(100, "Иконка слишком длинная"),
  order: z
    .string()
    .trim()
    .min(1, "Укажите порядок")
    .transform(Number)
    .pipe(
      z
        .number()
        .int("Порядок должен быть целым числом")
        .min(0, "Порядок не может быть отрицательным")
        .max(2147483647, "Значение слишком большое"),
    ),
})

export type CategoryFormState = {
  success?: boolean
  message?: string
  errors?: Partial<Record<"name" | "slug" | "icon" | "order", string[]>>
}

export type CategoryInput = z.infer<typeof categorySchema>
