import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import * as repository from "../repository/get-product"
import { parseCatalogParams, getCatalogHref, getLastPage } from "../catalog-params"

export async function getCatalog(category: string | undefined, data: unknown) {
  const params = parseCatalogParams(data)
  let totalProducts: number
  try {
    totalProducts = await repository.getActiveProductsCount(category, params.search)
  } catch (error) {
    console.error("Не удалось подсчитать товары каталога", error)
    throw error
  }
  const lastPage = getLastPage(totalProducts)
  if (params.page > lastPage) {
    redirect(
      getCatalogHref(category ? `/catalog/${category}` : "/catalog", { ...params, page: lastPage }),
    )
  }
  try {
    const products = await repository.getCatalogProducts(category, params)
    return { products, totalProducts, params }
  } catch (error) {
    console.error("Не удалось загрузить каталог", error)
    throw error
  }
}

export const getProductBySlug = cache(async (slug: string) => {
  try {
    return await repository.getProductBySlug(slug)
  } catch (error) {
    console.error("Не удалось загрузить товар", error)
    throw error
  }
})

export async function getRandomProducts() {
  try {
    const products = [...(await repository.getAllActiveProducts())]
    for (let index = products.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      ;[products[index], products[randomIndex]] = [products[randomIndex], products[index]]
    }
    const categories = new Set<string>()
    return products
      .filter((product) => {
        if (categories.has(product.category.slug)) return false
        categories.add(product.category.slug)
        return true
      })
      .slice(0, 4)
  } catch (error) {
    console.error("Не удалось загрузить подборку товаров", error)
    throw error
  }
}
