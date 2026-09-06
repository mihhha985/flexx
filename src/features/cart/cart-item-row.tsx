"use client"
import Link from "next/link"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { ProductVisual } from "@/src/entities/product/ui/product-visual"
import { formatPrice } from "@/src/shared/lib/format-price"
import { Button } from "@/src/shared/ui/button"
import { Card, CardContent, CardFooter } from "@/src/shared/ui/card"
import { useCartStore, type CartItem } from "./cart-store"

export function CartItemRow({
  item: { product, quantity },
  isSubmitting,
}: {
  item: CartItem
  isSubmitting: boolean
}) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  return (
    <Card size="sm">
      <CardContent className="flex gap-3">
        <ProductVisual product={product} compact />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <Link href={`/product/${product.slug}`} className="font-medium hover:underline">
              {product.name}
            </Link>
            {product.category && (
              <p className="text-sm text-muted-foreground">{product.category.name}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              className="flex items-center gap-1"
              aria-label={`Количество товара ${product.name}`}
            >
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Уменьшить"
                isDisabled={isSubmitting || quantity <= 1}
                onPress={() => updateQuantity(product.id, quantity - 1)}
              >
                <MinusIcon />
              </Button>
              <span className="min-w-7 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Увеличить"
                isDisabled={isSubmitting || quantity >= product.stock}
                onPress={() => updateQuantity(product.id, quantity + 1)}
              >
                <PlusIcon />
              </Button>
            </div>
            <p className="font-medium">{formatPrice(product.price * quantity)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-xs text-muted-foreground">{formatPrice(product.price)} за шт.</span>
        <Button
          variant="ghost"
          size="xs"
          isDisabled={isSubmitting}
          onPress={() => removeItem(product.id)}
        >
          <Trash2Icon data-icon="inline-start" /> Удалить
        </Button>
      </CardFooter>
    </Card>
  )
}
