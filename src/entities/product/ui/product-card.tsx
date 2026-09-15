import Link from "next/link"
import { ProductVisual } from "@/src/entities/product/ui/product-visual"
import { FavoriteButton } from "@/src/features/favorites/favorite-button"
import { formatPrice } from "@/src/shared/lib/format-price"
import { Badge } from "@/src/shared/ui/badge"
import { LinkButton } from "@/src/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"

import type { Product } from "@/src/entities/product/domain"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card size="sm" variant="plain" className="h-full">
      <div className="relative">
        <Link href={`/product/${product.slug}`} aria-label={`Открыть товар ${product.name}`}>
          <ProductVisual product={product} />
        </Link>
        <FavoriteButton product={product} className="absolute right-2 top-2" />
      </div>
      <CardHeader>
        <CardTitle className="text-sm/5 font-medium sm:text-base/6">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-base font-semibold tabular-nums">{formatPrice(product.price)}</p>
        <div>
          <Badge variant={product.stock > 5 ? "secondary" : "outline"}>
            {product.stock > 5
              ? "В наличии"
              : product.stock > 0
                ? `Осталось ${product.stock}`
                : "Нет в наличии"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="mt-auto grid grid-cols-1 gap-2">
        <LinkButton
          href={`/product/${product.slug}`}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Подробнее
        </LinkButton>
      </CardFooter>
    </Card>
  )
}
