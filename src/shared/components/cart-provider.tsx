"use client"

import * as React from "react"

import type { ProductWithCategory } from "@/src/entities/product/domain"

export type CartItem = {
  product: ProductWithCategory
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (product: ProductWithCategory, quantity?: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)
const storageKey = "kontur-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const savedCart = window.localStorage.getItem(storageKey)
    const frame = window.requestAnimationFrame(() => {
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart) as CartItem[])
        } catch {
          window.localStorage.removeItem(storageKey)
        }
      }
      setReady(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  React.useEffect(() => {
    if (ready) {
      window.localStorage.setItem(storageKey, JSON.stringify(items))
    }
  }, [items, ready])

  const addItem = React.useCallback((product: ProductWithCategory, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        )
      }
      return [...current, { product, quantity: Math.min(quantity, product.stock) }]
    })
  }, [])

  const updateQuantity = React.useCallback((productId: number, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
          : item,
      ),
    )
  }, [])

  const removeItem = React.useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }, [])

  const clearCart = React.useCallback(() => setItems([]), [])
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
