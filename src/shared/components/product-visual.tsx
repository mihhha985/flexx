/* eslint-disable @next/next/no-img-element -- Product image URLs may use arbitrary CMS domains. */

import type { Product } from "@/src/entities/product/domain"
import { cn } from "@/src/shared/lib/utils"

export function ProductVisual(
  { product, compact = false }: { product: Pick<Product, "name" | "imageUrl">; compact?: boolean }
) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-muted",
        compact
          ? "aspect-square size-20 shrink-0 rounded-lg"
          : "aspect-4/3 w-full",
      )}
    >
      <img
        src={product.imageUrl !== null ? product.imageUrl : "/images/product-placeholder.png"}
        alt={`Изображение товара ${product.name}`}
        className="size-full object-cover"
      />
    </div>
  )
}
