/* eslint-disable @next/next/no-img-element -- Product image URLs may use arbitrary CMS domains. */

import type { Product } from "@/src/entities/product/domain"
import { cn } from "@/src/shared/lib/utils"

export function ProductVisual({
  product,
  compact = false,
}: {
  product: Pick<Product, "name" | "imageUrl">
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-muted",
        compact ? "aspect-square size-20 shrink-0" : "aspect-square w-full",
      )}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={`Изображение товара ${product.name}`}
          className={cn("size-full object-contain", compact ? "p-2" : "p-[10%]")}
        />
      ) : (
        <div className="flex size-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
          Фото пока нет
        </div>
      )}
    </div>
  )
}
