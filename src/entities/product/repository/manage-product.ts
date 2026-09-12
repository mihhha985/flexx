import "server-only"
import { db } from "@/src/prisma/db"
import type { CreateProductInput, ProductDetailInput, UpdateProductInput } from "../domain"

function transactionRepository(tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) {
  return {
    getProductCreateContext: async (data: CreateProductInput) => {
      const [category, duplicate] = await Promise.all([
        tx.orm.public.Category.select("id").where({ id: data.categoryId }).first(),
        tx.orm.public.Product.select("id").where({ slug: data.slug }).first(),
      ])
      return { category, duplicate }
    },
    getProductEditContext: async (data: UpdateProductInput) => {
      const [product, category, duplicate, detail] = await Promise.all([
        tx.orm.public.Product.select("id").where({ id: data.id }).first(),
        tx.orm.public.Category.select("id").where({ id: data.categoryId }).first(),
        tx.orm.public.Product.select("id").where({ slug: data.slug }).first(),
        tx.orm.public.ProductDetail.select("id").where({ productId: data.id }).first(),
      ])
      return { product, category, duplicate, detail }
    },
    createProduct: (data: CreateProductInput) =>
      tx.orm.public.Product.create({
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        price: data.price,
        stock: data.stock,
        description: data.description,
        imageUrl: data.imageUrl,
        isActive: true,
      }),
    updateProduct: (data: UpdateProductInput) =>
      tx.orm.public.Product.where({ id: data.id }).select("id").update({
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        price: data.price,
        stock: data.stock,
        description: data.description,
        imageUrl: data.imageUrl,
      }),
    saveProductDetail: (productId: number, data: ProductDetailInput, exists: boolean) => {
      const detail = { color: data.color, size: data.size, country: data.country }
      return exists
        ? tx.orm.public.ProductDetail.where({ productId }).select("id").update(detail)
        : tx.orm.public.ProductDetail.create({ ...detail, productId })
    },
  }
}
export type ProductTransactionRepository = ReturnType<typeof transactionRepository>

export async function withProductTransaction<T>(
  operation: (repository: ProductTransactionRepository) => Promise<T>,
): Promise<T> {
  return db.transaction((tx) => operation(transactionRepository(tx)))
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
