import type { ZodError } from "zod"

import {
  createProductFormSchema,
  MAX_PRODUCT_VARIANTS,
  updateProductFormSchema,
  type ProductFormInput,
  type ProductVariantFieldErrors,
  type UpdateProductState,
} from "../domain"

function readVariants(formData: FormData) {
  const rawCount = Number(formData.get("variantCount"))
  const count =
    Number.isInteger(rawCount) && rawCount > 0 ? Math.min(rawCount, MAX_PRODUCT_VARIANTS + 1) : 0
  const primaryIndex = Number(formData.get("primaryVariant"))

  return Array.from({ length: count }, (_, index) => {
    const sizes = formData.getAll(`variants.${index}.size`)
    const stocks = formData.getAll(`variants.${index}.stock`)
    return {
      id: formData.get(`variants.${index}.id`),
      colorName: formData.get(`variants.${index}.colorName`),
      colorSlug: formData.get(`variants.${index}.colorSlug`),
      colorHex: formData.get(`variants.${index}.colorHex`),
      price: formData.get(`variants.${index}.price`),
      isActive: index === primaryIndex || formData.get(`variants.${index}.isActive`) === "on",
      order: index === primaryIndex ? 0 : index < primaryIndex ? index + 1 : index,
      sizes: sizes.map((size, sizeIndex) => ({ size, stock: stocks[sizeIndex] })),
    }
  })
}

function readCommonFields(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    country: formData.get("country"),
    description: formData.get("description"),
    variants: readVariants(formData),
  }
}

export function parseCreateProductForm(formData: FormData) {
  return createProductFormSchema.safeParse(readCommonFields(formData))
}

export function parseUpdateProductForm(formData: FormData) {
  return updateProductFormSchema.safeParse({
    ...readCommonFields(formData),
    id: formData.get("id"),
  })
}

function addError(target: Record<string, string[] | undefined>, field: string, message: string) {
  target[field] = [...(target[field] ?? []), message]
}

export function productFormErrors(error: ZodError<ProductFormInput>): UpdateProductState {
  const errors: NonNullable<UpdateProductState["errors"]> = {}
  const variantErrors: Record<number, ProductVariantFieldErrors> = {}

  for (const issue of error.issues) {
    if (issue.path[0] === "variants" && typeof issue.path[1] === "number") {
      const index = issue.path[1]
      const field = typeof issue.path[2] === "string" ? issue.path[2] : "sizes"
      const current = (variantErrors[index] ??= {})
      addError(current, field, issue.message)
      continue
    }

    const field = typeof issue.path[0] === "string" ? issue.path[0] : "variants"
    addError(errors, field, issue.message)
  }

  return {
    errors,
    variantErrors: Object.keys(variantErrors).length ? variantErrors : undefined,
  }
}
