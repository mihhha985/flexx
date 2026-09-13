"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, Trash2Icon } from "lucide-react"

import { ProductVisual } from "@/src/entities/product/ui/product-visual"
import {
  selectFavoriteItemCount,
  useFavoritesStore,
} from "@/src/features/favorites/favorites-store"
import { formatPrice } from "@/src/shared/lib/format-price"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/shared/ui/sheet"

export function FavoritesSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const sliderRef = useRef<HTMLUListElement>(null)
  const items = useFavoritesStore((state) => state.items)
  const itemCount = useFavoritesStore(selectFavoriteItemCount)
  const removeItem = useFavoritesStore((state) => state.removeItem)

  const scrollSlider = (direction: -1 | 1) => {
    const slider = sliderRef.current
    if (!slider) return

    slider.scrollBy({
      left: direction * Math.min(slider.clientWidth * 0.85, 320),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    })
  }

  const closeSheet = () => setIsOpen(false)

  return (
    <SheetTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon-sm"
        className="relative"
        aria-label={`Избранное, товаров: ${itemCount}`}
      >
        <HeartIcon className={cn(itemCount > 0 && "fill-current")} />
        {itemCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem]/4 font-semibold text-primary-foreground"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </Button>

      <SheetContent side="top" className="max-h-[min(36rem,calc(100dvh-1rem))] gap-0">
        <SheetHeader className="mx-auto w-full max-w-7xl px-4 py-5 pr-16 sm:px-6 sm:pr-16 lg:px-8 lg:pr-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <SheetTitle>Избранное</SheetTitle>
              <SheetDescription>
                {itemCount > 0
                  ? `Сохранено: ${itemCount} ${getProductWord(itemCount)} на этом устройстве`
                  : "Сохраняйте товары, чтобы быстро вернуться к ним"}
              </SheetDescription>
            </div>
            {items.length > 1 ? (
              <div className="hidden shrink-0 gap-2 sm:flex">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Предыдущие товары"
                  onPress={() => scrollSlider(-1)}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Следующие товары"
                  onPress={() => scrollSlider(1)}
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            ) : null}
          </div>
        </SheetHeader>

        <div className="border-t">
          {items.length > 0 ? (
            <ul
              ref={sliderRef}
              aria-label="Избранные товары"
              className="mx-auto flex w-full max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 py-5 sm:px-6 lg:gap-6 lg:px-8"
            >
              {items.map((product) => (
                <li
                  key={product.id}
                  className="w-[min(76vw,17rem)] shrink-0 snap-start sm:w-64 lg:w-72"
                >
                  <article className="flex h-full flex-col gap-3">
                    <div className="relative">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeSheet}
                        className="ui-focus block rounded-lg"
                      >
                        <ProductVisual product={product} />
                      </Link>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="absolute right-2 top-2 bg-background/95"
                        aria-label={`Убрать ${product.name} из избранного`}
                        onPress={() => removeItem(product.id)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeSheet}
                        className="ui-focus rounded-sm text-sm/5 font-medium hover:underline sm:text-base/6"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold tabular-nums">{formatPrice(product.price)}</p>
                        <Badge variant={product.stock > 0 ? "secondary" : "outline"}>
                          {product.stock > 0 ? "В наличии" : "Нет в наличии"}
                        </Badge>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 lg:px-8">
              <span className="flex size-12 items-center justify-center rounded-lg bg-muted">
                <HeartIcon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">В избранном пока пусто</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Нажмите на сердце в карточке понравившегося товара
                </p>
              </div>
              <Link href="/catalog" onClick={closeSheet} className={buttonVariants({ size: "sm" })}>
                Перейти в каталог
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </SheetTrigger>
  )
}

function getProductWord(count: number) {
  const lastTwoDigits = count % 100
  const lastDigit = count % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "товаров"
  if (lastDigit === 1) return "товар"
  if (lastDigit >= 2 && lastDigit <= 4) return "товара"
  return "товаров"
}
