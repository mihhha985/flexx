import "server-only"

import { requireAdmin } from "@/src/entities/admin/services/sessionService"
import { db } from "@/src/prisma/db"
import { ProductUpdateError, type UpdateProductInput } from "../domain"

export async function updateProduct(data: UpdateProductInput) {
  await requireAdmin()

  const [product, category, productWithSameSlug] = await Promise.all([
    db.orm.public.Product.select("id").where({ id: data.id }).first(),
    db.orm.public.Category.select("id").where({ id: data.categoryId }).first(),
    db.orm.public.Product.select("id").where({ slug: data.slug }).first(),
  ])

  if (!product) {
    throw new ProductUpdateError("Товар не найден.")
  }
  if (!category) {
    throw new ProductUpdateError("Выбранная категория не найдена.")
  }
  if (productWithSameSlug && productWithSameSlug.id !== data.id) {
    throw new ProductUpdateError("Товар с таким слагом уже существует.")
  }

  await db.orm.public.Product.where({ id: data.id }).update({
    name: data.name,
    slug: data.slug,
    categoryId: data.categoryId,
    price: data.price,
    stock: data.stock,
    description: data.description,
    imageUrl: data.imageUrl,
  })
}
