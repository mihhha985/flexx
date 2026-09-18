import assert from "node:assert/strict"
import test from "node:test"

import type { CreateOrderInput } from "../domain"
import type { OrderTransactionRepository } from "../repository/create-order"
import { createOrder } from "./create-order"

const input: CreateOrderInput = {
  customerName: "Анна",
  customerEmail: "anna@example.com",
  customerPhone: "+79991234567",
  shippingAddress: "Москва",
  items: [
    { variantId: 2, size: 42, quantity: 1 },
    { variantId: 1, size: 43, quantity: 2 },
  ],
}

const variants = [
  {
    id: 1,
    colorName: "Чёрный",
    colorSlug: "black",
    price: 1499.5,
    order: 0,
    isActive: true,
    product: { id: 10, name: "Первый", isActive: true },
    sizes: [
      { id: 11, size: 42, stock: 3 },
      { id: 12, size: 43, stock: 3 },
    ],
  },
  {
    id: 2,
    colorName: "Белый",
    colorSlug: "white",
    price: 0.1,
    order: 1,
    isActive: true,
    product: { id: 20, name: "Второй", isActive: true },
    sizes: [{ id: 21, size: 42, stock: 2 }],
  },
]

function repository(overrides: Partial<OrderTransactionRepository> = {}) {
  const reservedVariants: number[] = []
  const reservedSizes: number[] = []
  const orders: unknown[] = []
  const items: unknown[] = []
  const repo: OrderTransactionRepository = {
    getVariants: async (ids) => variants.filter((variant) => ids.includes(variant.id)),
    reserveVariant: async (variant) => {
      reservedVariants.push(variant.id)
      return 1
    },
    reserveSize: async (size) => {
      reservedSizes.push(size.id)
      return 1
    },
    insertOrder: async (data) => {
      orders.push(data)
      return {
        ...data,
        id: 7,
        publicId: "public-id",
        status: "pending",
        comment: data.comment ?? null,
        createdAt: "2026-09-06T00:00:00Z",
        updatedAt: "2026-09-06T00:00:00Z",
      }
    },
    insertItems: async (orderId, values) => {
      items.push(...values)
      return values.map((value, index) => ({ ...value, id: index + 1, orderId }))
    },
    ...overrides,
  }
  return { repo, reservedVariants, reservedSizes, orders, items }
}

test("checkout uses variant prices, deterministic reservations and snapshots", async () => {
  const state = repository()
  assert.equal(await createOrder(input, state.repo), "public-id")
  assert.deepEqual(state.reservedVariants, [1, 2])
  assert.deepEqual(state.reservedSizes, [12, 21])
  assert.equal((state.orders[0] as { total: number }).total, 2999.1)
  assert.deepEqual(state.items[0], {
    productId: 10,
    variantId: 1,
    productName: "Первый",
    colorName: "Чёрный",
    colorSlug: "black",
    size: 43,
    unitPrice: 1499.5,
    quantity: 2,
  })
  assert.deepEqual(state.items[1], {
    productId: 20,
    variantId: 2,
    productName: "Второй",
    colorName: "Белый",
    colorSlug: "white",
    size: 42,
    unitPrice: 0.1,
    quantity: 1,
  })
})

test("checkout stops before inserting an order when stock changed concurrently", async () => {
  const state = repository({ reserveSize: async () => 0 })
  await assert.rejects(createOrder(input, state.repo), /Остаток товара изменился/)
  assert.deepEqual(state.orders, [])
  assert.deepEqual(state.items, [])
})

test("checkout stops before inserting an order when variant changed concurrently", async () => {
  const state = repository({ reserveVariant: async () => 0 })
  await assert.rejects(createOrder(input, state.repo), /Доступность или цена товара изменились/)
  assert.deepEqual(state.orders, [])
  assert.deepEqual(state.items, [])
})

test("checkout reserves each size independently and the variant once", async () => {
  const state = repository()
  await createOrder(
    {
      ...input,
      items: [
        { variantId: 1, size: 43, quantity: 1 },
        { variantId: 1, size: 42, quantity: 2 },
      ],
    },
    state.repo,
  )
  assert.deepEqual(state.reservedVariants, [1])
  assert.deepEqual(state.reservedSizes, [11, 12])
})

test("checkout rejects a size that is no longer available", async () => {
  const state = repository()
  await assert.rejects(
    createOrder({ ...input, items: [{ variantId: 1, size: 41, quantity: 1 }] }, state.repo),
    /Размер 41/,
  )
  assert.deepEqual(state.orders, [])
})

test("checkout rejects missing, inactive, insufficient and invalid-price variants", async () => {
  for (const records of [
    [],
    [{ ...variants[0], isActive: false }],
    [{ ...variants[0], product: { ...variants[0].product, isActive: false } }],
    [{ ...variants[0], sizes: [{ id: 12, size: 43, stock: 1 }] }],
    [{ ...variants[0], price: Infinity }],
  ]) {
    const state = repository({ getVariants: async () => records })
    await assert.rejects(
      createOrder({ ...input, items: [{ variantId: 1, size: 43, quantity: 2 }] }, state.repo),
    )
    assert.deepEqual(state.orders, [])
  }
})
