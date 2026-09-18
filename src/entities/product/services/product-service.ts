import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import * as repository from "../repository/get-product"
import { parseCatalogParams, getCatalogHref, getLastPage } from "../catalog-params"
import { PRODUCTS_PER_PAGE } from "../catalog-params"
import type { Product } from "../domain"

type CatalogRow = Awaited<ReturnType<typeof repository.getCatalogProductRows>>[number]

function toCatalogProduct(row: CatalogRow): Product | null {
  const variant = row.variants[0]
  if (!variant) return null

  return {
    id: row.id,
    variantId: variant.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    colorName: variant.colorName,
    colorSlug: variant.colorSlug,
    colorHex: variant.colorHex,
    price: variant.price,
    avatar: variant.avatar,
    images: variant.images,
    stock: variant.sizes.reduce((total, item) => total + item.stock, 0),
    isActive: row.isActive && variant.isActive,
  }
}

export async function getCatalog(category: string | undefined, data: unknown) {
  const params = parseCatalogParams(data)
  let products: Product[]
  try {
    products = (await repository.getCatalogProductRows(category, params.search)).flatMap((row) => {
      const product = toCatalogProduct(row)
      return product ? [product] : []
    })
  } catch (error) {
    console.error("Не удалось загрузить каталог", error)
    throw error
  }
  products.sort((left, right) => {
    const comparison =
      params.sort === "price" ? left.price - right.price : left.name.localeCompare(right.name, "ru")
    return (params.order === "asc" ? comparison : -comparison) || left.id - right.id
  })

  const totalProducts = products.length
  const lastPage = getLastPage(totalProducts)
  if (params.page > lastPage) {
    redirect(
      getCatalogHref(category ? `/catalog/${category}` : "/catalog", { ...params, page: lastPage }),
    )
  }
  const pageStart = (params.page - 1) * PRODUCTS_PER_PAGE
  return {
    products: products.slice(pageStart, pageStart + PRODUCTS_PER_PAGE),
    totalProducts,
    params,
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
    const products = (await repository.getAllActiveProductRows()).flatMap((row) => {
      const product = toCatalogProduct(row)
      return product ? [{ ...product, category: row.category }] : []
    })
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

export async function getActiveProductSlugs() {
  try {
    return await repository.getActiveProductSlugs()
  } catch (error) {
    console.error("Не удалось загрузить адреса товаров для карты сайта", error)
    throw error
  }
}
