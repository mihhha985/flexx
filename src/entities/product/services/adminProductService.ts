import "server-only"

import { getAdminProducts } from "../repositiry/getAdminProducts"

export async function getProductsForAdmin() {
  const products = await getAdminProducts()
  return products.map(({ category, ...product }) => ({ ...product, categoryName: category.name }))
}

export type AdminProduct = Awaited<ReturnType<typeof getProductsForAdmin>>[number]
