import assert from "node:assert/strict"
import { beforeEach, test } from "node:test"

import type { Product } from "@/src/entities/product/domain"
import {
  selectFavoriteItemCount,
  selectIsFavorite,
  useFavoritesStore,
} from "@/src/features/favorites/favorites-store"

const storage = new Map<string, string>()
const product: Product = {
  id: 1,
  name: "Товар",
  slug: "product",
  price: 150,
  imageUrl: null,
  stock: 5,
  isActive: true,
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
  useFavoritesStore.setState({ items: [], ready: false })
  storage.clear()
})

test("toggles products without duplicates and derives the count", () => {
  const { toggleItem } = useFavoritesStore.getState()
  toggleItem(product)
  toggleItem(product)
  toggleItem(product)
  toggleItem({ ...product, id: 2, slug: "second-product" })

  assert.equal(selectFavoriteItemCount(useFavoritesStore.getState()), 2)
  assert.equal(selectIsFavorite(product.id)(useFavoritesStore.getState()), true)
})

test("removes a favorite and persists the result", () => {
  const { toggleItem, removeItem } = useFavoritesStore.getState()
  toggleItem(product)
  toggleItem({ ...product, id: 2, slug: "second-product" })
  removeItem(product.id)

  assert.deepEqual(
    useFavoritesStore.getState().items.map((item) => item.id),
    [2],
  )
  assert.deepEqual(JSON.parse(storage.get("kontur-favorites")!), {
    state: { items: [{ ...product, id: 2, slug: "second-product" }] },
    version: 0,
  })
})

test("hydrates valid unique favorites only when requested", async () => {
  storage.set(
    "kontur-favorites",
    JSON.stringify({ state: { items: [product, product] }, version: 0 }),
  )

  assert.equal(useFavoritesStore.getState().ready, false)
  await useFavoritesStore.persist.rehydrate()

  assert.equal(useFavoritesStore.getState().ready, true)
  assert.deepEqual(useFavoritesStore.getState().items, [product])
})

test("finishes hydration for missing and invalid saved data", async () => {
  for (const saved of [null, "broken JSON", '{"state":{"items":[{}]},"version":0}']) {
    useFavoritesStore.setState({ items: [], ready: false })
    if (saved === null) storage.clear()
    else storage.set("kontur-favorites", saved)

    await useFavoritesStore.persist.rehydrate()
    assert.equal(useFavoritesStore.getState().ready, true)
    assert.deepEqual(useFavoritesStore.getState().items, [])
  }
})

test("keeps actions working when browser storage is unavailable", async (context) => {
  context.mock.method(console, "warn", () => {})
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => {
      throw new Error("Storage blocked")
    },
  })

  await useFavoritesStore.persist.rehydrate()
  useFavoritesStore.getState().toggleItem(product)
  assert.equal(selectFavoriteItemCount(useFavoritesStore.getState()), 1)
})
