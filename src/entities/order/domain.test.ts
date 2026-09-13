import assert from "node:assert/strict"
import { test } from "node:test"

import { orderSchema } from "./domain"

const input = {
  customerName: " Анна ",
  customerEmail: " anna@example.com ",
  customerPhone: "+7 (999) 123-45-67",
  shippingAddress: " Москва, ул. Примерная, 1 ",
  comment: " Позвоните заранее ",
  items: [{ productId: 1, size: 42, quantity: 2 }],
}

test("normalizes contact details and strips client-supplied totals, prices and status", () => {
  const result = orderSchema.parse({
    ...input,
    total: 1,
    status: "paid",
    items: [{ ...input.items[0], unitPrice: 0, productName: "Подмена" }],
  })
  assert.equal(result.customerName, "Анна")
  assert.equal(result.customerEmail, "anna@example.com")
  assert.equal(result.shippingAddress, "Москва, ул. Примерная, 1")
  assert.equal(result.comment, "Позвоните заранее")
  assert.equal("total" in result, false)
  assert.equal("status" in result, false)
  assert.deepEqual(result.items, [{ productId: 1, size: 42, quantity: 2 }])
})

test("rejects empty carts, duplicate products and invalid quantities or IDs", () => {
  for (const items of [
    [],
    [input.items[0], input.items[0]],
    [{ productId: 1, size: 34, quantity: 1 }],
    [{ productId: 1, size: 49, quantity: 1 }],
    [{ productId: 1, quantity: 0 }],
    [{ productId: 1, quantity: -1 }],
    [{ productId: 1, quantity: 1.5 }],
    [{ productId: 1, quantity: "2" }],
    [{ productId: 0, quantity: 1 }],
    [{ productId: 1, quantity: Infinity }],
    [{ productId: 1, quantity: 2147483648 }],
  ]) {
    assert.equal(orderSchema.safeParse({ ...input, items }).success, false)
  }
})

test("allows one product in different sizes", () => {
  assert.equal(
    orderSchema.safeParse({
      ...input,
      items: [input.items[0], { productId: 1, size: 43, quantity: 1 }],
    }).success,
    true,
  )
})

test("rejects missing contacts, invalid email and phone, and oversized requests", () => {
  for (const changes of [
    { customerName: "   " },
    { customerEmail: "invalid" },
    { customerPhone: "123" },
    { customerPhone: "abcdefghijk" },
    { shippingAddress: "  " },
    { comment: "x".repeat(2001) },
    { items: Array.from({ length: 101 }, (_, index) => ({ productId: index + 1, quantity: 1 })) },
  ]) {
    assert.equal(orderSchema.safeParse({ ...input, ...changes }).success, false)
  }
  assert.equal(orderSchema.safeParse(null).success, false)
})

test("allows an omitted comment", () => {
  assert.equal(orderSchema.safeParse({ ...input, comment: undefined }).success, true)
})
