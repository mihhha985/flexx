import assert from "node:assert/strict"
import { test } from "node:test"

import { createProductSchema, updateProductSchema } from "./domain"

const input = {
  id: "1",
  name: "  Чайник  ",
  slug: "electric-kettle",
  categoryId: "2",
  price: "1499.50",
  stock: "12",
  description: "  Электрический чайник.  ",
  imageUrl: "",
}

test("normalizes product edits and turns an empty image URL into null", () => {
  const result = updateProductSchema.parse(input)

  assert.deepEqual(result, {
    id: 1,
    name: "Чайник",
    slug: "electric-kettle",
    categoryId: 2,
    price: 1499.5,
    stock: 12,
    description: "Электрический чайник.",
    imageUrl: null,
  })
})

test("rejects invalid product edits", () => {
  for (const changes of [
    { id: "0" },
    { name: "   " },
    { slug: "Не валидный" },
    { categoryId: "" },
    { price: "-1" },
    { stock: "1.5" },
    { description: "" },
    { imageUrl: "not-a-url" },
  ]) {
    assert.equal(updateProductSchema.safeParse({ ...input, ...changes }).success, false)
  }
})

test("creating a product validates fields without requiring an id or accepting visibility overrides", () => {
  const { id: _id, ...fields } = input
  void _id
  const result = createProductSchema.parse({ ...fields, id: "999", isActive: false })
  assert.equal(result.name, "Чайник")
  assert.equal(result.price, 1499.5)
  assert.equal(result.imageUrl, null)
  assert.equal("id" in result, false)
  assert.equal("isActive" in result, false)
  for (const changes of [
    { categoryId: "" },
    { price: "Infinity" },
    { stock: "-1" },
    { slug: "../product" },
  ]) {
    assert.equal(createProductSchema.safeParse({ ...fields, ...changes }).success, false)
  }
})
