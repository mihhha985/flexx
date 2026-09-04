"use client"

import { useEffect } from "react"

import { useCartStore } from "@/src/store/cart-store"

export function CartHydration() {
  useEffect(() => {
    if (!useCartStore.getState().ready) {
      void useCartStore.persist.rehydrate()
    }
  }, [])

  return null
}
