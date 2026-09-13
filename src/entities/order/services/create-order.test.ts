import assert from "node:assert/strict"
import test from "node:test"
import { createOrder } from "./create-order"
import type { OrderTransactionRepository } from "../repository/create-order"
import type { CreateOrderInput } from "../domain"

const input: CreateOrderInput = {
  customerName: "Анна",
  customerEmail: "anna@example.com",
  customerPhone: "+79991234567",
  shippingAddress: "Москва",
  items: [
    { productId: 2, size: 42, quantity: 1 },
    { productId: 1, size: 43, quantity: 2 },
  ],
}
const products = [
  { id: 1, name: "Первый", price: 1499.5, stock: 3, isActive: true, detail: { size: [42, 43] } },
  { id: 2, name: "Второй", price: 0.1, stock: 2, isActive: true, detail: { size: [42] } },
]
function repository(overrides: Partial<OrderTransactionRepository> = {}) {
  const reserved: number[] = []
  const orders: unknown[] = []
  const items: unknown[] = []
  const repo: OrderTransactionRepository = {
    getProducts: async () => products,
    reserveProduct: async (product) => {
      reserved.push(product.id)
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
  return { repo, reserved, orders, items }
}

test("checkout uses database prices, deterministic stock reservation and price snapshots", async () => {
  const state = repository()
  assert.equal(await createOrder(input, state.repo), "public-id")
  assert.deepEqual(state.reserved, [1, 2])
  assert.equal((state.orders[0] as { total: number }).total, 2999.1)
  assert.deepEqual(state.items[0], {
    productId: 1,
    productName: "Первый",
    size: 43,
    unitPrice: 1499.5,
    quantity: 2,
  })
})

test("checkout stops before inserting an order when stock changed concurrently", async () => {
  const state = repository({ reserveProduct: async () => 0 })
  await assert.rejects(createOrder(input, state.repo), /Наличие или цена/)
  assert.deepEqual(state.orders, [])
  assert.deepEqual(state.items, [])
})

test("checkout reserves the shared stock once for a product in different sizes", async () => {
  const state = repository()
  const publicId = await createOrder(
    {
      ...input,
      items: [
        { productId: 1, size: 43, quantity: 1 },
        { productId: 1, size: 42, quantity: 2 },
      ],
    },
    state.repo,
  )
  assert.equal(publicId, "public-id")
  assert.deepEqual(state.reserved, [1])
  assert.deepEqual(
    state.items.map((item) => (item as { size: number }).size),
    [42, 43],
  )
})

test("checkout rejects a size that is no longer available", async () => {
  const state = repository()
  await assert.rejects(
    createOrder({ ...input, items: [{ productId: 1, size: 41, quantity: 1 }] }, state.repo),
    /Размер 41/,
  )
  assert.deepEqual(state.orders, [])
})

test("checkout rejects missing, inactive, insufficient and invalid-price products", async () => {
  for (const records of [
    [],
    [{ ...products[0], isActive: false }],
    [{ ...products[0], stock: 1 }],
    [{ ...products[0], price: Infinity }],
  ]) {
    const state = repository({ getProducts: async () => records })
    await assert.rejects(createOrder(input, state.repo))
    assert.deepEqual(state.orders, [])
  }
})
