"use client"

import { useEffect } from "react"

import { useFavoritesStore } from "@/src/features/favorites/favorites-store"

export function FavoritesHydration() {
  useEffect(() => {
    if (!useFavoritesStore.getState().ready) {
      void useFavoritesStore.persist.rehydrate()
    }
  }, [])

  return null
}
