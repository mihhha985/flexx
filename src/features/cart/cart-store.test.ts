import assert from "node:assert/strict"
import { beforeEach, test } from "node:test"

import type { ProductWithCategory } from "@/src/entities/product/domain"
import { selectCartItemCount, selectCartTotal, useCartStore } from "@/src/features/cart/cart-store"

const storage = new Map<string, string>()
const product: ProductWithCategory = {
  id: 1,
  name: "Товар",
  slug: "product",
  price: 150,
  imageUrl: null,
  stock: 5,
  isActive: true,
  category: { name: "Категория", slug: "category", order: 1 },
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  })
  useCartStore.setState({ items: [], ready: false })
  storage.clear()
})

test("combines repeated products, caps stock and derives cart totals", () => {
  const { addItem, updateQuantity } = useCartStore.getState()
  addItem(product, 2)
  addItem(product, 10)
  addItem({ ...product, id: 2, price: 200 }, 2)
  assert.equal(useCartStore.getState().items.length, 2)
  assert.equal(selectCartItemCount(useCartStore.getState()), 7)
  assert.equal(selectCartTotal(useCartStore.getState()), 1150)

  updateQuantity(1, 0)
  assert.equal(useCartStore.getState().items[0].quantity, 1)
  updateQuantity(1, 100)
  assert.equal(useCartStore.getState().items[0].quantity, 5)
})

test("rejects unavailable products and invalid quantities", () => {
  const { addItem, updateQuantity } = useCartStore.getState()
  addItem({ ...product, stock: 0 })
  for (const quantity of [0, -1, 1.5, NaN, Infinity]) addItem(product, quantity)
  assert.deepEqual(useCartStore.getState().items, [])
  addItem(product)
  updateQuantity(product.id, NaN)
  assert.equal(useCartStore.getState().items[0].quantity, 1)
})

test("removes a product and persists an empty cart after checkout", () => {
  const { addItem, removeItem, clearCart } = useCartStore.getState()
  addItem(product)
  addItem({ ...product, id: 2 })
  removeItem(product.id)
  assert.deepEqual(
    useCartStore.getState().items.map((item) => item.product.id),
    [2],
  )
  clearCart()
  assert.deepEqual(JSON.parse(storage.get("kontur-cart")!), {
    state: { items: [] },
    version: 0,
  })
})

test("hydrates legacy carts only when requested and rewrites the persist format", async () => {
  const items = [{ product, quantity: 3 }]
  storage.set("kontur-cart", JSON.stringify(items))
  assert.equal(useCartStore.getState().ready, false)
  assert.deepEqual(useCartStore.getState().items, [])

  await useCartStore.persist.rehydrate()
  assert.equal(useCartStore.getState().ready, true)
  assert.deepEqual(useCartStore.getState().items, items)
  assert.deepEqual(JSON.parse(storage.get("kontur-cart")!), {
    state: { items },
    version: 0,
  })
  assert.equal(useCartStore.getInitialState().ready, false)
  assert.deepEqual(useCartStore.getInitialState().items, [])
})

test("restores the new format and limits quantities to saved stock", async () => {
  storage.set(
    "kontur-cart",
    JSON.stringify({
      state: { items: [{ product, quantity: 10 }], ready: true },
      version: 0,
    }),
  )
  await useCartStore.persist.rehydrate()
  assert.equal(useCartStore.getState().items[0].quantity, 5)
  assert.equal(selectCartTotal(useCartStore.getState()), 750)
  assert.equal(typeof useCartStore.getState().addItem, "function")
})

test("finishes hydration for missing, malformed and invalid saved data", async () => {
  for (const saved of [null, "broken JSON", '{"state":{"items":[{}]},"version":0}']) {
    useCartStore.setState({ items: [], ready: false })
    if (saved === null) storage.clear()
    else storage.set("kontur-cart", saved)
    await useCartStore.persist.rehydrate()
    assert.equal(useCartStore.getState().ready, true)
    assert.deepEqual(useCartStore.getState().items, [])
  }
})

test("restores catalog products without category data", async () => {
  const catalogProduct = { ...product }
  Reflect.deleteProperty(catalogProduct, "category")
  useCartStore.getState().addItem(catalogProduct, 2)
  useCartStore.setState({ items: [], ready: false })
  // setState persists too, so restore the saved checkout cart before hydration.
  storage.set(
    "kontur-cart",
    JSON.stringify({
      state: { items: [{ product: catalogProduct, quantity: 2 }] },
      version: 0,
    }),
  )
  await useCartStore.persist.rehydrate()
  assert.equal(selectCartItemCount(useCartStore.getState()), 2)
  assert.equal(useCartStore.getState().items[0].product.category, undefined)
})

test("keeps cart actions working when browser storage is unavailable", async (context) => {
  context.mock.method(console, "warn", () => {})
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => {
      throw new Error("Storage blocked")
    },
  })
  await useCartStore.persist.rehydrate()
  assert.equal(useCartStore.getState().ready, true)
  useCartStore.getState().addItem(product)
  assert.equal(selectCartItemCount(useCartStore.getState()), 1)
  useCartStore.getState().clearCart()
  assert.equal(selectCartItemCount(useCartStore.getState()), 0)
})
