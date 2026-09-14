"use client"

import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"
import { z } from "zod"

import type { Product, ProductWithCategory } from "@/src/entities/product/domain"

type CartProduct = Product & Partial<Pick<ProductWithCategory, "category">>

export type CartItem = {
  product: CartProduct
  size: number
  quantity: number
}

type CartState = {
  ready: boolean
  items: CartItem[]
  addItem: (product: Product, size: number, quantity?: number) => void
  updateQuantity: (productId: number, size: number, quantity: number) => void
  removeItem: (productId: number, size: number) => void
  clearCart: () => void
  setReady: () => void
}

const savedCartProductFieldsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().positive(),
  isActive: z.boolean(),
  category: z
    .object({ name: z.string(), slug: z.string(), order: z.number(), icon: z.string() })
    .optional(),
})

const savedCartProductSchema = z.union([
  savedCartProductFieldsSchema.extend({ avatar: z.string(), images: z.array(z.string()) }),
  savedCartProductFieldsSchema
    .extend({ imageUrl: z.string().nullable() })
    .transform(({ imageUrl, ...product }) => ({
      ...product,
      avatar: imageUrl ?? "",
      images: [],
    })),
])

const savedCartSchema = z.object({
  items: z.array(
    z.object({
      product: savedCartProductSchema,
      size: z.number().int().min(35).max(48),
      quantity: z.number().int().positive(),
    }),
  ),
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
      addItem: (product, size, quantity = 1) => {
        if (
          !Number.isInteger(size) ||
          size < 35 ||
          size > 48 ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          product.stock < 1
        )
          return

        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id && item.size === size,
          )
          const quantityOfOtherSizes = state.items
            .filter((item) => item.product.id === product.id && item.size !== size)
            .reduce((sum, item) => sum + item.quantity, 0)
          const maximumQuantity = product.stock - quantityOfOtherSizes
          if (maximumQuantity < 1) return state
          const item = {
            product,
            size,
            quantity: Math.min((existing?.quantity ?? 0) + quantity, maximumQuantity),
          }

          return {
            items: existing
              ? state.items.map((current) =>
                  current.product.id === product.id && current.size === size ? item : current,
                )
              : [...state.items, item],
          }
        })
      },
      updateQuantity: (productId, size, quantity) => {
        if (!Number.isInteger(quantity)) return

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.size === size
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(
                      quantity,
                      item.product.stock -
                        state.items
                          .filter(
                            (current) => current.product.id === productId && current.size !== size,
                          )
                          .reduce((sum, current) => sum + current.quantity, 0),
                    ),
                  ),
                }
              : item,
          ),
        }))
      },
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId || item.size !== size),
        })),
      clearCart: () => set({ items: [] }),
      setReady: () => set({ ready: true }),
    }),
    {
      name: "kontur-cart",
      storage: createJSONStorage(() => cartStorage, {
        // The context implementation stored a bare array under the same key.
        reviver: (key, value) =>
          key === "" && Array.isArray(value) ? { state: { items: value }, version: 0 } : value,
      }),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = savedCartSchema.safeParse(persisted)
        return {
          ...current,
          items: saved.success
            ? saved.data.items.reduce<CartItem[]>((items, item) => {
                const reserved = items
                  .filter((current) => current.product.id === item.product.id)
                  .reduce((sum, current) => sum + current.quantity, 0)
                const quantity = Math.min(item.quantity, Math.max(0, item.product.stock - reserved))
                return quantity > 0 ? [...items, { ...item, quantity }] : items
              }, [])
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
