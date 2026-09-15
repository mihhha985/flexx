import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { getCategoriesForAdmin } from "@/src/entities/category/services/admin-category-service"
import { getProductForAdmin } from "@/src/entities/product/services/admin-product-service"
import { LinkButton } from "@/src/shared/ui/button"
import { ProductForm } from "../../product-form"

export const metadata: Metadata = { title: "Редактирование товара" }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id) || id < 1) notFound()

  const [product, categories] = await Promise.all([getProductForAdmin(id), getCategoriesForAdmin()])
  if (!product) notFound()

  return (
    <section className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <LinkButton href="/panel/products" variant="outline" size="icon" aria-label="К товарам">
          <ArrowLeftIcon />
        </LinkButton>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Редактировать товар</h1>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>
      </div>

      <ProductForm product={product} categories={categories} />
    </section>
  )
}
