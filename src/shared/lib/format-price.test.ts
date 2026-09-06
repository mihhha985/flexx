import assert from "node:assert/strict"
import test from "node:test"
import { formatPrice } from "./format-price"

test("prices preserve kopecks and do not force decimals for whole rubles", () => {
  assert.match(formatPrice(1499.5), /1\s499,5/)
  assert.match(formatPrice(0.01), /0,01/)
  assert.doesNotMatch(formatPrice(1500), /,00/)
})
