"use client"

import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"
import { z } from "zod"

import type { ProductWithCategory } from "@/src/entities/product/domain"

export type CartItem = {
  product: ProductWithCategory
  quantity: number
}

type CartState = {
  ready: boolean
  items: CartItem[]
  addItem: (product: ProductWithCategory, quantity?: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  setReady: () => void
}

const savedCartSchema = z.object({
  items: z.array(z.object({
    product: z.object({
      id: z.number().int(),
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      price: z.number().nonnegative(),
      imageUrl: z.string().nullable(),
      stock: z.number().int().positive(),
      isActive: z.boolean(),
      category: z.object({ name: z.string(), slug: z.string(), order: z.number() }),
    }),
    quantity: z.number().int().positive(),
  })),
})

// Keep the in-memory cart usable when browser storage is blocked or full.
const cartStorage: StateStorage = {
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
      console.warn("Не удалось сохранить корзину на устройстве")
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn("Не удалось удалить сохранённую корзину")
    }
  },
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ready: false,
      items: [],
      addItem: (product, quantity = 1) => {
        if (!Number.isInteger(quantity) || quantity < 1 || product.stock < 1) return

        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id)
          const item = {
            product,
            quantity: Math.min((existing?.quantity ?? 0) + quantity, product.stock),
          }

          return {
            items: existing
              ? state.items.map((current) => current.product.id === product.id ? item : current)
              : [...state.items, item],
          }
        })
      },
      updateQuantity: (productId, quantity) => {
        if (!Number.isInteger(quantity)) return

        set((state) => ({
          items: state.items.map((item) => item.product.id === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
            : item),
        }))
      },
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      })),
      clearCart: () => set({ items: [] }),
      setReady: () => set({ ready: true }),
    }),
    {
      name: "kontur-cart",
      storage: createJSONStorage(() => cartStorage, {
        // The context implementation stored a bare array under the same key.
        reviver: (key, value) => key === "" && Array.isArray(value)
          ? { state: { items: value }, version: 0 }
          : value,
      }),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = savedCartSchema.safeParse(persisted)
        return {
          ...current,
          items: saved.success
            ? saved.data.items.map((item) => ({
                ...item,
                quantity: Math.min(item.quantity, item.product.stock),
              }))
            : current.items,
        }
      },
      onRehydrateStorage: (state) => () => state.setReady(),
    },
  ),
)

export const selectCartItemCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
