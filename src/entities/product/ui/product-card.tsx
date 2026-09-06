import { AddToCartButton } from "@/src/features/cart/add-to-cart-button"

import Link from "next/link"
import { ProductVisual } from "@/src/entities/product/ui/product-visual"
import { formatPrice } from "@/src/shared/lib/format-price"
import { Badge } from "@/src/shared/ui/badge"
import { LinkButton } from "@/src/shared/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"

import type { Product } from "@/src/entities/product/domain"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card size="sm" className="h-full">
      <ProductVisual product={product} />
      <CardHeader>
        <CardTitle>
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <CardAction>
          <Badge variant={product.stock > 5 ? "secondary" : "outline"}>
            {product.stock > 5 ? "В наличии" : `Осталось ${product.stock}`}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-base font-medium">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <LinkButton
          href={`/product/${product.slug}`}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Подробнее
        </LinkButton>
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  )
}
