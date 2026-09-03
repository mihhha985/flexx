import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PackageCheckIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"

import { ProductPurchase } from "@/src/shared/components/product-purchase"
import { ProductVisual } from "@/src/shared/components/product-visual"
import { getProductBySlug } from "@/src/entities/product/repositiry/getProduct"
import { Badge } from "@/src/shared/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/src/shared/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug)
  if (!product) notFound();

  return product
    ? { title: `${product.name} — Контур`, description: product.description }
    : { title: "Товар не найден — Контур" }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug)
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <div className="flex flex-col gap-5">
          <Card>
            <ProductVisual product={product} />
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{product.category.name}</Badge>
                <Badge variant="outline">В наличии: {product.stock}</Badge>
              </div>
              <CardTitle className="text-2xl sm:text-3xl">{product.name}</CardTitle>
              <CardDescription className="text-base">{product.description}</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: TruckIcon, title: "Быстрая доставка", text: "По городу за 1–2 дня" },
              { icon: ShieldCheckIcon, title: "Проверка заказа", text: "Подтвердим по телефону" },
              { icon: RotateCcwIcon, title: "Простой возврат", text: "14 дней на решение" },
            ].map((benefit) => (
              <Card key={benefit.title} size="sm">
                <CardHeader>
                  <benefit.icon className="text-muted-foreground" />
                  <CardTitle>{benefit.title}</CardTitle>
                  <CardDescription>{benefit.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card size="sm">
            <CardHeader>
              <PackageCheckIcon className="text-muted-foreground" />
              <CardTitle>О товаре</CardTitle>
              <CardDescription>
                Артикул {String(product.id).padStart(5, "0")} · Категория «{product.category.name}». Актуальное наличие показываем перед добавлением в корзину.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contacts" className="text-sm underline underline-offset-4">Задать вопрос о товаре</Link>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ProductPurchase product={product} />
        </aside>
      </div>
    </div>
  )
}
