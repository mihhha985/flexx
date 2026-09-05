import { z } from "zod"
import {
  getActiveProductsCount,
  getAllActiveProducts,
  getAllProductsByCategory,
} from "../repositiry/getProduct"
import type { ProductWithCategory, Product } from "../domain"
import { LIMIT } from "../domain"

function getFirstParam(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value
}

const searchParamsSchema = z.object({
  search: z.preprocess(
    getFirstParam,
    z.string().trim().catch(""),
  ).transform((value) => value || undefined),
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
): Promise<Product[]> {
  try {
    const validatedData: SearchParams = searchParamsSchema.parse(data)
    console.log("getValidatedProducts - someData:", validatedData);
    const offset = (validatedData.page - 1) * LIMIT

    return await getAllProductsByCategory(
      category,
      LIMIT,
      offset,
      validatedData.sort,
      validatedData.order,
      validatedData.search,
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

export async function getTotalActiveProducts(
  category?: string,
  data?: unknown,
): Promise<number> {
  const { search } = searchParamsSchema.parse(data)

  return await getActiveProductsCount(category, search)
}
