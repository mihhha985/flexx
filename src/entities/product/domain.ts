import type { Category } from "@/src/entities/category/domain"

export const LIMIT = 12;

export type ProductSort = "name" | "price"
export type ProductOrder = "asc" | "desc"

export type Product = {
  id: number;
  name: string
  slug: string
  description?: string
  price: number
  imageUrl: string | null
  stock: number
  isActive: boolean
}

export type ProductWithCategory = Product & {
  category: Category
}
