import type { Metadata } from "next"
import { ArrowLeftIcon, FolderPlusIcon } from "lucide-react"

import { getCategoriesForAdmin } from "@/src/entities/category/services/admin-category-service"
import { LinkButton } from "@/src/shared/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"
import { ProductForm } from "../product-form"

export const metadata: Metadata = { title: "Новый товар" }

export default async function NewProductPage() {
  const categories = await getCategoriesForAdmin()

  return (
    <section className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <LinkButton href="/panel/products" variant="outline" size="icon" aria-label="К товарам">
          <ArrowLeftIcon />
        </LinkButton>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Создать товар</h1>
          <p className="text-sm text-muted-foreground">
            Добавьте цвета, цены, изображения и размерные остатки товара.
          </p>
        </div>
      </div>

      {categories.length ? (
        <ProductForm categories={categories} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Сначала создайте категорию</EmptyTitle>
            <EmptyDescription>Без категории создать товар не получится.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <LinkButton href="/panel/categories">Перейти к категориям</LinkButton>
          </EmptyContent>
        </Empty>
      )}
    </section>
  )
}
