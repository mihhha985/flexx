import "server-only"
import { cache } from "react"
import * as repository from "../repository/get-category"

export const getCategories = cache(async () => {
  try {
    return await repository.getCategories()
  } catch (error) {
    console.error("Не удалось загрузить категории", error)
    throw error
  }
})

export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    return await repository.getCategoryBySlug(slug)
  } catch (error) {
    console.error("Не удалось загрузить категорию", error)
    throw error
  }
})
