import "server-only"

import { db } from "@/src/prisma/db"
import type { CreateProductInput, UpdateProductInput } from "../domain"

type ProductInput = CreateProductInput | UpdateProductInput
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

function productData(data: ProductInput) {
  return {
    name: data.name,
    slug: data.slug,
    categoryId: data.categoryId,
    country: data.country,
    description: data.description,
  }
}

function variantData(productId: number, variant: ProductInput["variants"][number]) {
  return {
    productId,
    colorName: variant.colorName,
    colorSlug: variant.colorSlug,
    colorHex: variant.colorHex,
    price: variant.price,
    avatar: variant.avatar,
    images: variant.images,
    isActive: variant.isActive,
    order: variant.order,
  }
}

async function createVariant(
  tx: Transaction,
  productId: number,
  variant: ProductInput["variants"][number],
) {
  const created = await tx.orm.public.ProductVariant.create(variantData(productId, variant))
  await tx.orm.public.ProductVariantSize.createAll(
    variant.sizes.map((item) => ({ ...item, variantId: created.id })),
  )
}

function transactionRepository(tx: Transaction) {
  return {
    getProductCreateContext: async (data: Pick<CreateProductInput, "categoryId" | "slug">) => {
      const [category, duplicate] = await Promise.all([
        tx.orm.public.Category.select("id").where({ id: data.categoryId }).first(),
        tx.orm.public.Product.select("id").where({ slug: data.slug }).first(),
      ])
      return { category, duplicate }
    },
    getProductEditContext: async (data: Pick<UpdateProductInput, "id" | "categoryId" | "slug">) => {
      const [product, category, duplicate] = await Promise.all([
        tx.orm.public.Product.select("id")
          .include("variants", (variants) =>
            variants.select("id", "avatar", "images").orderBy((variant) => variant.order.asc()),
          )
          .where({ id: data.id })
          .first(),
        tx.orm.public.Category.select("id").where({ id: data.categoryId }).first(),
        tx.orm.public.Product.select("id").where({ slug: data.slug }).first(),
      ])
      return { product, category, duplicate }
    },
    createProduct: async (data: CreateProductInput) => {
      const product = await tx.orm.public.Product.create({ ...productData(data), isActive: true })
      for (const variant of data.variants) await createVariant(tx, product.id, variant)
      return product
    },
    updateProduct: async (data: UpdateProductInput) => {
      const existingVariants = await tx.orm.public.ProductVariant.select("id")
        .include("sizes", (sizes) => sizes.select("id", "size"))
        .where({ productId: data.id })
        .orderBy((variant) => variant.id.asc())
        .all()
      const existingIds = new Set(existingVariants.map((variant) => variant.id))
      const retainedIds = new Set(
        data.variants.flatMap((variant) => (variant.id === undefined ? [] : [variant.id])),
      )

      if ([...retainedIds].some((id) => !existingIds.has(id))) return null

      const product = await tx.orm.public.Product.where({ id: data.id })
        .select("id")
        .update(productData(data))
      if (!product) return null

      for (const [index, variant] of existingVariants.entries()) {
        await tx.orm.public.ProductVariant.where({ id: variant.id }).update({
          order: 1000 + index,
        })
      }

      for (const variant of existingVariants) {
        if (!retainedIds.has(variant.id)) {
          await tx.orm.public.ProductVariant.where({ id: variant.id }).delete()
        }
      }

      for (const variant of data.variants) {
        if (variant.id === undefined) {
          await createVariant(tx, data.id, variant)
          continue
        }

        await tx.orm.public.ProductVariant.where({ id: variant.id }).update(
          variantData(data.id, variant),
        )

        const existingVariant = existingVariants.find((current) => current.id === variant.id)
        if (!existingVariant) return null
        const submittedSizes = new Map(variant.sizes.map((item) => [item.size, item]))
        const existingSizes = new Map(existingVariant.sizes.map((item) => [item.size, item]))

        for (const size of existingVariant.sizes) {
          if (!submittedSizes.has(size.size)) {
            await tx.orm.public.ProductVariantSize.where({ id: size.id }).delete()
          }
        }

        for (const size of variant.sizes) {
          const existingSize = existingSizes.get(size.size)
          if (existingSize) {
            await tx.orm.public.ProductVariantSize.where({ id: existingSize.id }).update({
              stock: size.stock,
            })
          } else {
            await tx.orm.public.ProductVariantSize.create({
              ...size,
              variantId: variant.id,
            })
          }
        }
      }

      return product
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

export async function getProductMedia(id: number) {
  return db.orm.public.Product.select("id")
    .include("variants", (variants) => variants.select("id", "avatar", "images"))
    .where({ id })
    .first()
}

export async function deleteProduct(id: number) {
  return db.orm.public.Product.where({ id }).delete()
}
