import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MessageCircleIcon, PackageCheckIcon, ShieldCheckIcon } from "lucide-react"

import { SITE_URL } from "@/env"
import { ProductPurchase } from "@/src/entities/product/ui/product-purchase"
import { getProductBySlug } from "@/src/entities/product/services/product-service"
import { toMetaDescription } from "@/src/shared/lib/seo"
import { Badge } from "@/src/shared/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/src/shared/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { ProductGallery } from "./product-gallery"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug)
  const primaryVariant = product?.variants[0]
  if (!product || !primaryVariant) notFound()

  const description = toMetaDescription(product.description)
  const url = `/product/${product.slug}`

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | FLEXX`,
      description,
      url,
      siteName: "FLEXX",
      locale: "ru_RU",
      type: "website",
      images: [{ url: primaryVariant.avatar, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | FLEXX`,
      description,
      images: [primaryVariant.avatar],
    },
  }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ color?: string | string[] }>
}) {
  const product = await getProductBySlug((await params).slug)
  if (!product || !product.variants.length) notFound()
  const requestedColor = (await searchParams).color
  const colorSlug = Array.isArray(requestedColor) ? requestedColor[0] : requestedColor
  const variant =
    product.variants.find((candidate) => candidate.colorSlug === colorSlug) ?? product.variants[0]
  const stock = variant.sizes.reduce((total, item) => total + item.stock, 0)
  const variantUrl = `/product/${product.slug}?color=${variant.colorSlug}`

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [variant.avatar, ...variant.images],
    sku: String(variant.id),
    color: variant.colorName,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: new URL(variantUrl, SITE_URL).toString(),
      priceCurrency: "RUB",
      price: variant.price.toFixed(2),
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }

  return (
    <div className="flex flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/catalog/${product.category.slug}`}>
              {product.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <div className="flex flex-col gap-5">
          <Card className="py-0">
            <ProductGallery
              key={variant.id}
              product={{ name: product.name, avatar: variant.avatar, images: variant.images }}
            />
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{product.category.name}</Badge>
                <Badge variant="outline">
                  {stock > 0 ? `В наличии: ${stock}` : "Нет в наличии"}
                </Badge>
              </div>
              <CardTitle className="text-2xl sm:text-3xl">{product.name}</CardTitle>
              <CardDescription className="text-base">{product.description}</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: PackageCheckIcon,
                title: "Подтверждение заказа",
                text: "Свяжемся перед отправкой",
              },
              {
                icon: ShieldCheckIcon,
                title: "Проверка данных",
                text: "Цена и наличие уточняются при оформлении",
              },
              {
                icon: MessageCircleIcon,
                title: "Помощь с выбором",
                text: "Ответим на вопросы о товаре",
              },
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
                Страна-производитель: {product.country} · Категория «{product.category.name}
                ». Актуальное наличие показываем перед добавлением в корзину.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contacts" className="text-sm underline underline-offset-4">
                Задать вопрос о товаре
              </Link>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ProductPurchase key={variant.id} product={product} variant={variant} />
        </aside>
      </div>
    </div>
  )
}
