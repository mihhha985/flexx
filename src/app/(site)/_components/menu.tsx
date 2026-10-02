"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBagIcon } from "lucide-react"

import { navigation, isNavigationActive } from "@/src/app/(site)/_components/navigation"
import { selectCartItemCount, useCartStore } from "@/src/features/cart/cart-store"
import { FavoritesSheet } from "@/src/features/favorites/favorites-sheet"
import { cn } from "@/src/shared/lib/utils"
import { buttonVariants } from "@/src/shared/ui/button"

export default function Menu() {
  const pathname = usePathname()
  const itemCount = useCartStore(selectCartItemCount)

  return (
    <div className="flex items-center">
      <nav className="hidden items-center gap-4 md:flex" aria-label="Основная навигация">
        {navigation.map((item) => {
          const active = isNavigationActive(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`menu-link`}
            >
              <span className="flex items-center gap-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="ml-2 flex items-center gap-1 sm:ml-6 lg:ml-10">
        <FavoritesSheet />
        <Link
          href="/cart"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "relative")}
          aria-label={`Корзина, товаров: ${itemCount}`}
        >
          <ShoppingBagIcon />
          {itemCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem]/4 font-semibold text-primary-foreground"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          ) : null}
        </Link>
      </div>
    </div>
  )
}
