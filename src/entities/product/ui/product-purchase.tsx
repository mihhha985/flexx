"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"

import type { Product, ProductVariant, ProductWithCategory } from "@/src/entities/product/domain"
import { getVariantStock } from "@/src/entities/product/domain"
import { useCartStore } from "@/src/features/cart/cart-store"
import { formatPrice } from "@/src/shared/lib/format-price"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Separator } from "@/src/shared/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/src/shared/ui/toggle-group"

export function ProductPurchase({
  product,
  variant,
}: {
  product: ProductWithCategory
  variant: ProductVariant
}) {
  const [quantity, setQuantity] = React.useState(1)
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null)
  const [added, setAdded] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const ready = useCartStore((state) => state.ready)
  const selectedSizeData = variant.sizes.find((item) => item.size === selectedSize)
  const availableStock = selectedSizeData?.stock ?? 0
  const totalStock = getVariantStock(variant)

  const buttonLabel =
    totalStock < 1
      ? "Нет в наличии"
      : added
        ? "Добавлено"
        : selectedSize === null
          ? "Выберите размер"
          : "Добавить в корзину"

  function handleAdd() {
    if (selectedSize === null || !selectedSizeData || selectedSizeData.stock < 1) {
      toast.error("Выберите доступный размер")
      return
    }

    const cartProduct: Product = {
      id: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      colorName: variant.colorName,
      colorSlug: variant.colorSlug,
      colorHex: variant.colorHex,
      price: variant.price,
      avatar: variant.avatar,
      images: variant.images,
      stock: selectedSizeData.stock,
      isActive: product.isActive && variant.isActive,
    }
    addItem(cartProduct, selectedSize, quantity)
    setAdded(true)
    toast.success("Добавлено в корзину", {
      description: `${product.name}, ${variant.colorName} · ${quantity} шт.`,
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
          <span className="text-xl font-medium">{formatPrice(variant.price)}</span>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Цвет: {variant.colorName}</p>
          <div className="grid gap-2" aria-label="Цвета товара">
            {product.variants.map((option) => {
              const isSelected = option.id === variant.id
              const optionStock = getVariantStock(option)
              return (
                <Link
                  key={option.id}
                  href={`/product/${product.slug}?color=${option.colorSlug}`}
                  scroll={false}
                  aria-current={isSelected ? "page" : undefined}
                  aria-label={`${option.colorName}${isSelected ? ", выбран" : ""}`}
                  className={cn(
                    "ui-focus grid min-h-16 grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 rounded-md border p-2 text-sm outline-none transition-colors duration-150",
                    isSelected ? "border-foreground bg-muted" : "border-input hover:bg-muted",
                  )}
                >
                  <span className="relative size-12 overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={option.avatar}
                      alt=""
                      className="absolute inset-0 size-full object-contain p-1"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        aria-hidden="true"
                        className="size-4 shrink-0 rounded-sm border border-border"
                        style={{ backgroundColor: option.colorHex }}
                      />
                      <span className="truncate">{option.colorName}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {optionStock > 0 ? `В наличии: ${optionStock}` : "Нет в наличии"}
                    </span>
                  </span>
                  <span className="text-right font-medium tabular-nums">
                    {formatPrice(option.price)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Размер</p>
          <ToggleGroup
            aria-label="Выберите размер"
            selectionMode="single"
            selectedKeys={selectedSize === null ? new Set() : new Set([String(selectedSize)])}
            onSelectionChange={(keys) => {
              const key = keys.values().next().value
              setSelectedSize(key === undefined ? null : Number(key))
              setQuantity(1)
              setAdded(false)
            }}
            variant="outline"
            size="sm"
            className="flex w-full flex-wrap gap-2"
          >
            {variant.sizes.map((item) => (
              <ToggleGroupItem
                key={item.id}
                id={String(item.size)}
                isDisabled={item.stock < 1}
                aria-label={
                  item.stock > 0 ? `Размер ${item.size}` : `Размер ${item.size}, нет в наличии`
                }
              >
                {item.size}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-xs text-muted-foreground">
            Недоступные размеры нельзя выбрать. Система размеров: EU.
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Количество</p>
            <p className="text-xs text-muted-foreground">
              {selectedSize === null ? "Сначала выберите размер" : `Доступно: ${availableStock}`}
            </p>
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
              isDisabled={selectedSize === null || quantity >= availableStock}
              onPress={() => setQuantity((value) => Math.min(availableStock, value + 1))}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Итого</span>
          <span className="text-base font-medium">{formatPrice(variant.price * quantity)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          size="lg"
          isDisabled={!ready || selectedSize === null || availableStock < 1}
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
