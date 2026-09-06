import assert from "node:assert/strict"
import test from "node:test"
import { getOrderStats, orderStatuses, type OrderStatus } from "./status"

test("empty orders have zero counts and a finite conversion rate", () => {
  assert.deepEqual(getOrderStats([]), {
    total: 0,
    pending: 0,
    cancelled: 0,
    confirmed: 0,
    confirmationRate: 0,
  })
})

test("confirmation includes all stages after confirmation except cancellation", () => {
  const orders = (Object.keys(orderStatuses) as OrderStatus[]).map((status) => ({ status }))
  const stats = getOrderStats(orders)
  assert.equal(stats.total, 6)
  assert.equal(stats.pending, 1)
  assert.equal(stats.cancelled, 1)
  assert.equal(stats.confirmed, 4)
  assert.equal(stats.confirmationRate, (4 / 6) * 100)
  assert.equal(getOrderStats([{ status: "cancelled" }]).confirmationRate, 0)
  assert.equal(getOrderStats([{ status: "completed" }]).confirmationRate, 100)
})
