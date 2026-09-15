import type { Metadata } from "next"
import { Badge } from "@/src/shared/ui/badge"
import { CatalogView } from "@/src/app/(site)/catalog/_components/catalog-view"
import { ProductPagination } from "@/src/app/(site)/catalog/_components/product-pagination"
import { getCatalog } from "@/src/entities/product/services/product-service"
import { defaultSocialImage } from "@/src/shared/lib/seo"

export const metadata: Metadata = {
  title: "Каталог кроссовок и обуви",
  description:
    "Каталог кроссовок и повседневной обуви FLEXX: поиск моделей, фильтрация по брендам, актуальные цены и наличие.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Каталог кроссовок и обуви | FLEXX",
    description: "Выбирайте кроссовки и обувь по брендам в каталоге FLEXX.",
    url: "/catalog",
    siteName: "FLEXX",
    locale: "ru_RU",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог кроссовок и обуви | FLEXX",
    description: "Выбирайте кроссовки и обувь по брендам в каталоге FLEXX.",
    images: [defaultSocialImage.url],
  },
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const search = await searchParams
  const { products, totalProducts, params: catalogParams } = await getCatalog(undefined, search)

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-medium tracking-tight">Все товары</h2>
        <Badge variant="secondary">
          Показано: {products.length} из {totalProducts}
        </Badge>
      </div>
      <CatalogView visibleProducts={products} />
      <div className="mt-8">
        <ProductPagination totalProducts={totalProducts} params={catalogParams} />
      </div>
    </div>
  )
}
