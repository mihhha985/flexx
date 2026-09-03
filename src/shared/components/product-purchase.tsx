"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/src/shared/components/cart-provider"
import { formatPrice } from "@/src/shared/lib/catalog"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Separator } from "@/src/shared/ui/separator"
import type { ProductWithCategory } from "@/src/entities/product/domain"

export function ProductPurchase({ product }: { product: ProductWithCategory }) {
  const [quantity, setQuantity] = React.useState(1)
  const [added, setAdded] = React.useState(false)
  const { addItem } = useCart()

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    toast.success("Добавлено в корзину", {
      description: `${product.name} · ${quantity} шт.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заказать</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Цена</span>
          <span className="text-xl font-medium">{formatPrice(product.price)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Количество</p>
            <p className="text-xs text-muted-foreground">Доступно: {product.stock}</p>
          </div>
          <div className="flex items-center gap-2" aria-label="Количество товара">
            <Button
              variant="outline"
              size="icon"
              aria-label="Уменьшить количество"
              isDisabled={quantity <= 1}
              onPress={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <MinusIcon />
            </Button>
            <span className="min-w-8 text-center font-medium" aria-live="polite">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Увеличить количество"
              isDisabled={quantity >= product.stock}
              onPress={() => setQuantity((value) => Math.min(product.stock, value + 1))}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Итого</span>
          <span className="text-base font-medium">{formatPrice(product.price * quantity)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" size="lg" onPress={handleAdd}>
          {added ? <CheckIcon data-icon="inline-start" /> : <ShoppingBagIcon data-icon="inline-start" />}
          {added ? "Добавлено" : "Добавить в корзину"}
        </Button>
        {added ? (
          <Link href="/cart" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
            Перейти к оформлению
          </Link>
        ) : (
          <Badge variant="secondary">Заказ без регистрации</Badge>
        )}
      </CardFooter>
    </Card>
  )
}
