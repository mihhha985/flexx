"use client"

import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/src/store/cart-store"
import { ProductVisual } from "@/src/shared/components/product-visual"
import { formatPrice } from "@/src/shared/lib/catalog"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"

import type { Product } from "@/src/entities/product/domain";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const ready = useCartStore((state) => state.ready)

  function handleAdd() {
    addItem(product)
    toast.success("Товар добавлен в корзину", { description: product.name })
  }

  return (
    <Card size="sm" className="h-full cursor-pointer" onClick={() => router.push(`/product/${product.slug}`)}>
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
        <Link
          href={`/product/${product.slug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
        >
          Подробнее
        </Link>
        <Button size="sm" className="w-full" isDisabled={!ready || product.stock < 1} onPress={handleAdd}>
          <ShoppingBagIcon data-icon="inline-start" />
          В корзину
        </Button>
      </CardFooter>
    </Card>
  )
}
