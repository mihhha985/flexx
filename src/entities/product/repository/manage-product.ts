import "server-only"
import { db } from "@/src/prisma/db"
import type { UpdateProductInput } from "../domain"

export async function getProductEditContext(id: number, categoryId: number, slug: string) {
  const [product, category, duplicate] = await Promise.all([
    db.orm.public.Product.select("id").where({ id }).first(),
    db.orm.public.Category.select("id").where({ id: categoryId }).first(),
    db.orm.public.Product.select("id").where({ slug }).first(),
  ])
  return { product, category, duplicate }
}
export async function getProductCreateContext(categoryId: number, slug: string) {
  const [category, duplicate] = await Promise.all([
    db.orm.public.Category.select("id").where({ id: categoryId }).first(),
    db.orm.public.Product.select("id").where({ slug }).first(),
  ])
  return { category, duplicate }
}
export async function createProduct(data: Omit<UpdateProductInput, "id">) {
  return db.orm.public.Product.create({ ...data, isActive: true })
}
export async function updateProduct({ id, ...data }: UpdateProductInput) {
  return db.orm.public.Product.where({ id }).select("id").update(data)
}
export async function setProductActive(id: number, isActive: boolean) {
  return db.orm.public.Product.where({ id }).select("id").update({ isActive })
}
export async function getProductOrderItem(productId: number) {
  return db.orm.public.OrderItem.where({ productId }).select("id").first()
}
export async function deleteProduct(id: number) {
  return db.orm.public.Product.where({ id }).delete()
}
