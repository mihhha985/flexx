import assert from "node:assert/strict"
import { test } from "node:test"

import { parseCreateProductForm } from "./product-form-data"

function productFormData() {
  const formData = new FormData()
  formData.set("name", "Кроссовки")
  formData.set("slug", "running-shoes")
  formData.set("categoryId", "1")
  formData.set("country", "Россия")
  formData.set("description", "Лёгкие кроссовки")
  formData.set("variantCount", "2")
  formData.set("primaryVariant", "1")

  for (const [index, color] of [
    { name: "Белый", slug: "white", hex: "#FFFFFF" },
    { name: "Чёрный", slug: "black", hex: "#000000" },
  ].entries()) {
    formData.set(`variants.${index}.colorName`, color.name)
    formData.set(`variants.${index}.colorSlug`, color.slug)
    formData.set(`variants.${index}.colorHex`, color.hex)
    formData.set(`variants.${index}.price`, "10000")
    formData.set(`variants.${index}.size`, "42")
    formData.set(`variants.${index}.stock`, "1")
  }

  return formData
}

test("keeps the primary variant active when its disabled checkbox is omitted", () => {
  const result = parseCreateProductForm(productFormData())

  assert.equal(result.success, true)
  if (!result.success) return
  assert.equal(result.data.variants[0].isActive, false)
  assert.equal(result.data.variants[0].order, 1)
  assert.equal(result.data.variants[1].isActive, true)
  assert.equal(result.data.variants[1].order, 0)
})
