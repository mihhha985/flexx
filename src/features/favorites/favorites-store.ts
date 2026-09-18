"use client"

import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"
import { z } from "zod"

import type { Product } from "@/src/entities/product/domain"

type FavoritesState = {
  ready: boolean
  items: Product[]
  toggleItem: (product: Product) => void
  removeItem: (variantId: number) => void
  setReady: () => void
}

const savedFavoriteProductFieldsSchema = z.object({
  id: z.number().int().positive(),
  variantId: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  colorName: z.string(),
  colorSlug: z.string(),
  colorHex: z.string(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  isActive: z.boolean(),
})

const savedFavoriteProductSchema = z.union([
  savedFavoriteProductFieldsSchema.extend({ avatar: z.string(), images: z.array(z.string()) }),
  savedFavoriteProductFieldsSchema
    .extend({ imageUrl: z.string().nullable() })
    .transform(({ imageUrl, ...product }) => ({
      ...product,
      avatar: imageUrl ?? "",
      images: [],
    })),
])

const savedFavoritesSchema = z.object({
  items: z.array(savedFavoriteProductSchema),
})

// Keep favorites usable when browser storage is blocked or full.
const favoritesStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      console.warn("Не удалось сохранить избранное на устройстве")
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn("Не удалось удалить сохранённое избранное")
    }
  },
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ready: false,
      items: [],
      toggleItem: (product) => {
        if (!Number.isInteger(product.variantId) || product.variantId < 1) return

        set((state) => ({
          items: state.items.some((item) => item.variantId === product.variantId)
            ? state.items.filter((item) => item.variantId !== product.variantId)
            : [...state.items, product],
        }))
      },
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((item) => item.variantId !== variantId) })),
      setReady: () => set({ ready: true }),
    }),
    {
      name: "kontur-favorites",
      storage: createJSONStorage(() => favoritesStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = savedFavoritesSchema.safeParse(persisted)
        return {
          ...current,
          items: saved.success
            ? saved.data.items.filter(
                (item, index, items) =>
                  items.findIndex((current) => current.variantId === item.variantId) === index,
              )
            : current.items,
        }
      },
      onRehydrateStorage: (state) => () => state.setReady(),
    },
  ),
)

export const selectFavoriteItemCount = (state: FavoritesState) => state.items.length

export const selectIsFavorite = (variantId: number) => (state: FavoritesState) =>
  state.items.some((item) => item.variantId === variantId)
