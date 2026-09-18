import assert from "node:assert/strict"
import { test } from "node:test"

import { createProductFormSchema, updateProductFormSchema } from "./domain"

const variant = {
  colorName: "  Чёрный  ",
  colorSlug: "black",
  colorHex: "#000000",
  price: "1499.50",
  order: "0",
  isActive: true,
  sizes: [
    { size: "42", stock: "3" },
    { size: "43", stock: "0" },
  ],
}

const input = {
  id: "1",
  name: "  Кроссовки  ",
  slug: "running-shoes",
  categoryId: "2",
  country: "  Россия  ",
  description: "  Лёгкие кроссовки.  ",
  variants: [variant],
}

test("normalizes a product with color variants and size stock", () => {
  const result = updateProductFormSchema.parse(input)

  assert.equal(result.id, 1)
  assert.equal(result.name, "Кроссовки")
  assert.equal(result.country, "Россия")
  assert.equal(result.variants[0].colorName, "Чёрный")
  assert.equal(result.variants[0].price, 1499.5)
  assert.deepEqual(result.variants[0].sizes, [
    { size: 42, stock: 3 },
    { size: 43, stock: 0 },
  ])
})

test("requires exactly one active primary variant and unique slugs and order", () => {
  for (const variants of [
    [{ ...variant, order: "1" }],
    [{ ...variant, isActive: false }],
    [variant, { ...variant, colorName: "Белый" }],
    [variant, { ...variant, colorSlug: "white", order: "0" }],
  ]) {
    assert.equal(createProductFormSchema.safeParse({ ...input, variants }).success, false)
  }
})

test("validates variant prices, colors, slugs and size rows", () => {
  for (const changes of [
    { colorName: "" },
    { colorSlug: "Белый цвет" },
    { colorHex: "black" },
    { price: "-1" },
    { sizes: [] },
    { sizes: [{ size: "34", stock: "1" }] },
    { sizes: [{ size: "42", stock: "-1" }] },
    {
      sizes: [
        { size: "42", stock: "1" },
        { size: "42", stock: "2" },
      ],
    },
  ]) {
    assert.equal(
      createProductFormSchema.safeParse({ ...input, variants: [{ ...variant, ...changes }] })
        .success,
      false,
    )
  }
})

test("creation ignores an id and validates common product fields", () => {
  const result = createProductFormSchema.parse(input)
  assert.equal("id" in result, false)

  for (const changes of [
    { name: "" },
    { slug: "../product" },
    { categoryId: "" },
    { country: "" },
    { description: "" },
  ]) {
    assert.equal(createProductFormSchema.safeParse({ ...input, ...changes }).success, false)
  }
})
