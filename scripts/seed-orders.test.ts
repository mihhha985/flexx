import assert from "node:assert/strict"
import test from "node:test"
import { orderSchema } from "../src/entities/order/domain.ts"
import { orderStatuses } from "../src/entities/order/status.ts"
import { generateFakeOrders } from "./seed-orders.ts"

const variants = [
  {
    id: 1,
    price: 1999.95,
    colorName: "Белый",
    colorSlug: "white",
    product: { id: 10, name: "Тестовые кроссовки", isActive: true },
    sizes: [{ size: 40 }, { size: 41 }, { size: 42 }],
  },
]

test("generates 94 valid orders with all statuses, unique contacts and correct totals", () => {
  const now = new Date("2026-10-04T12:00:00Z")
  const orders = generateFakeOrders(variants, now)
  assert.equal(orders.length, 94)
  for (const field of ["publicId", "customerName", "customerEmail", "customerPhone"] as const) {
    assert.equal(new Set(orders.map((order) => order[field])).size, 94)
  }
  for (const status of Object.keys(orderStatuses)) {
    const count = orders.filter((order) => order.status === status).length
    assert.ok(count === 15 || count === 16)
  }
  for (const order of orders) {
    assert.ok(orderSchema.safeParse(order).success)
    assert.match(
      order.customerEmail,
      /^[a-z]+[\d._a-z]*@(mail\.ru|yandex\.ru|gmail\.com|bk\.ru|inbox\.ru|list\.ru)$/,
    )
    assert.match(order.customerPhone, /^\+7 \(9\d{2}\) \d{3}-\d{2}-\d{2}$/)
    assert.ok(Date.parse(order.createdAt) <= Date.parse(order.updatedAt))
    assert.ok(Date.parse(order.updatedAt) <= now.getTime())
    assert.equal(
      order.total,
      order.items.reduce((sum, item) => sum + 199995 * item.quantity, 0) / 100,
    )
    for (const item of order.items) {
      assert.equal(item.productId, 10)
      assert.equal(item.variantId, 1)
      assert.equal(item.productName, "Тестовые кроссовки")
      assert.ok([40, 41, 42].includes(item.size))
    }
  }
})

test("rejects an empty catalog, unavailable products and invalid prices", () => {
  assert.throws(() => generateFakeOrders([]), /Нет активных товаров/)
  assert.throws(() => generateFakeOrders([{ ...variants[0], sizes: [] }]), /Нет активных товаров/)
  assert.throws(
    () =>
      generateFakeOrders([
        { ...variants[0], product: { ...variants[0].product, isActive: false } },
      ]),
    /Нет активных товаров/,
  )
  assert.throws(
    () => generateFakeOrders([{ ...variants[0], price: Number.NaN }]),
    /Некорректная цена/,
  )
})

test("supports a single available size without repeating a line or mutating the catalog", () => {
  const catalog = [{ ...variants[0], sizes: [{ size: 40 }] }]
  const snapshot = structuredClone(catalog)
  const orders = generateFakeOrders(catalog)
  assert.ok(orders.every((order) => order.items.length === 1))
  assert.deepEqual(catalog, snapshot)
})
