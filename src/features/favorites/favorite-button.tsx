"use client"

import { HeartIcon } from "lucide-react"

import type { Product } from "@/src/entities/product/domain"
import { selectIsFavorite, useFavoritesStore } from "@/src/features/favorites/favorites-store"
import { cn } from "@/src/shared/lib/utils"
import { Button } from "@/src/shared/ui/button"

export function FavoriteButton({ product, className }: { product: Product; className?: string }) {
  const isFavorite = useFavoritesStore(selectIsFavorite(product.id))
  const toggleItem = useFavoritesStore((state) => state.toggleItem)

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size="icon-sm"
      className={cn(
        "bg-background/95 data-pressed:[&_svg]:-rotate-6 data-pressed:[&_svg]:scale-75",
        isFavorite && "bg-primary text-primary-foreground",
        className,
      )}
      aria-label={
        isFavorite ? `Убрать ${product.name} из избранного` : `Добавить ${product.name} в избранное`
      }
      aria-pressed={isFavorite}
      onPress={() => toggleItem(product)}
    >
      <HeartIcon
        className={cn(
          "transition-[transform,fill] duration-150 ease-out motion-reduce:transition-none",
          isFavorite && "scale-105 fill-current",
        )}
      />
    </Button>
  )
}
