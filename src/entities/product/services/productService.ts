"use server"

import { z } from "zod"
import { getAllActiveProducts, getAllProducts } from "../repositiry/getProduct"
import type { ProductWithCategory } from "../domain"

const LIMIT = 12

function getFirstParam(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value
}

const searchParamsSchema = z.object({
  page: z.preprocess(
    getFirstParam,
    z.coerce.number().int().min(1).catch(1),
  ),
  sort: z.preprocess(
    getFirstParam,
    z.enum(["name", "price"]).catch("name"),
  ),
  order: z.preprocess(
    getFirstParam,
    z.enum(["asc", "desc"]).catch("asc"),
  ),
})

type SearchParams = z.infer<typeof searchParamsSchema>

export async function getValidatedProducts(
  category: string | undefined,
  data: unknown,
): Promise<ProductWithCategory[]> {
  try {
    const validatedData: SearchParams = searchParamsSchema.parse(data)
    console.log("getValidatedProducts - someData:", validatedData);
    const offset = (validatedData.page - 1) * LIMIT

    return await getAllProducts(
      category,
      LIMIT,
      offset,
      validatedData.sort,
      validatedData.order,
    )
  } catch (error) {
    console.error(error)
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
    console.error(error)
    throw error
  }
}
