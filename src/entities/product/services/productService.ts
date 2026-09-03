"use server"
import { z } from "zod"
import { getAllActiveProducts, getAllProducts } from "../repositiry/getProduct"
import type { ProductWithCategory } from "../domain";

type ProductProps = {
  category?: string
  limit?: number
  offset?: number
}

const schemaProduct = z.object({
  category: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export async function getValidatedProducts(props: ProductProps): Promise<ProductWithCategory[]> {
  try {
    const data = schemaProduct.parse(props)
    const products = await getAllProducts(data.category, data.limit, data.offset)
    return products
  } catch (error) {
    throw error
  }
}

export async function getRandomProducts(): Promise<ProductWithCategory[]> {
  try {
    const products = await getAllActiveProducts()
    const shuffledProducts = [...products]

    for (let index = shuffledProducts.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      ;[shuffledProducts[index], shuffledProducts[randomIndex]] = [
        shuffledProducts[randomIndex],
        shuffledProducts[index],
      ]
    }

    const categories = new Set<string>()

    return shuffledProducts
      .filter((product) => {
        const categorySlug = product.category.slug

        if (categories.has(categorySlug)) {
          return false
        }

        categories.add(categorySlug)
        return true
      })
      .slice(0, 4)
  } catch (error) {
    throw error
  }
}
