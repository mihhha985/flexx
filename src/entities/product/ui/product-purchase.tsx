"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"

import { useCartStore } from "@/src/features/cart/cart-store"
import { formatPrice } from "@/src/shared/lib/format-price"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Separator } from "@/src/shared/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/src/shared/ui/toggle-group"
import { productColors, type ProductWithCategory } from "@/src/entities/product/domain"

export function ProductPurchase({ product }: { product: ProductWithCategory }) {
  const [quantity, setQuantity] = React.useState(1)
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null)
  const [added, setAdded] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const ready = useCartStore((state) => state.ready)
  const detail = product.detail
  const colorLabel = detail
    ? (productColors.find((option) => option.value === detail.color)?.label ?? detail.color)
    : null
  const buttonLabel =
    product.stock < 1
      ? "Нет в наличии"
      : !detail
        ? "Размеры не указаны"
        : added
          ? "Добавлено"
          : selectedSize === null
            ? "Выберите размер"
            : "Добавить в корзину"

  function handleAdd() {
    if (selectedSize === null) {
      toast.error("Выберите размер", { description: "Перед добавлением товара выберите размер." })
      return
    }
    addItem(product, selectedSize, quantity)
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
        {detail ? (
          <>
            <Separator />
            <dl className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Цвет</dt>
                <dd className="flex items-center gap-2 text-sm font-medium">
                  <span
                    aria-hidden="true"
                    className="size-4 rounded-full border border-border"
                    style={{ backgroundColor: detail.color }}
                  />
                  {colorLabel}
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Размер</p>
              <ToggleGroup
                aria-label="Выберите размер"
                selectionMode="single"
                selectedKeys={selectedSize === null ? new Set() : new Set([String(selectedSize)])}
                onSelectionChange={(keys) => {
                  const key = keys.values().next().value
                  setSelectedSize(key === undefined ? null : Number(key))
                  setAdded(false)
                }}
                variant="outline"
                size="sm"
                className="flex w-full flex-wrap gap-2"
              >
                {detail.size.map((size) => (
                  <ToggleGroupItem key={size} id={String(size)}>
                    {size}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <p className="text-xs text-muted-foreground">
                Укажите размер перед добавлением в корзину.
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Размеры товара пока не указаны.</p>
        )}
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
            <span className="min-w-8 text-center font-medium" aria-live="polite">
              {quantity}
            </span>
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
        <Button
          className="w-full"
          size="lg"
          isDisabled={!ready || product.stock < 1 || !detail}
          onPress={handleAdd}
        >
          {added ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <ShoppingBagIcon data-icon="inline-start" />
          )}
          {buttonLabel}
        </Button>
        {added ? (
          <Link
            href="/cart"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
          >
            Перейти к оформлению
          </Link>
        ) : (
          <Badge variant="secondary">Заказ без регистрации</Badge>
        )}
      </CardFooter>
    </Card>
  )
}
