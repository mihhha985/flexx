"use client"

import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"
import { z } from "zod"

import type { Product } from "@/src/entities/product/domain"

type FavoritesState = {
  ready: boolean
  items: Product[]
  toggleItem: (product: Product) => void
  removeItem: (productId: number) => void
  setReady: () => void
}

const savedFavoritesSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      price: z.number().nonnegative(),
      imageUrl: z.string().nullable(),
      stock: z.number().int().nonnegative(),
      isActive: z.boolean(),
    }),
  ),
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
        if (!Number.isInteger(product.id) || product.id < 1) return

        set((state) => ({
          items: state.items.some((item) => item.id === product.id)
            ? state.items.filter((item) => item.id !== product.id)
            : [...state.items, product],
        }))
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),
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
                  items.findIndex((current) => current.id === item.id) === index,
              )
            : current.items,
        }
      },
      onRehydrateStorage: (state) => () => state.setReady(),
    },
  ),
)

export const selectFavoriteItemCount = (state: FavoritesState) => state.items.length

export const selectIsFavorite = (productId: number) => (state: FavoritesState) =>
  state.items.some((item) => item.id === productId)
