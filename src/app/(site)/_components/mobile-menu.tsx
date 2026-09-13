"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { selectCartItemCount, useCartStore } from "@/src/features/cart/cart-store"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { buttonVariants } from "@/src/shared/ui/button"

import { navigation, isNavigationActive } from "@/src/app/(site)/_components/navigation"

export default function MobileMenu() {
  const pathname = usePathname()
  const itemCount = useCartStore(selectCartItemCount)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 border-t bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
      aria-label="Мобильная навигация"
    >
      <div className="mx-auto flex items-center justify-between">
        {navigation.map((item) => {
          const active = isNavigationActive(pathname, item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "relative h-12 flex-col gap-1 px-1 text-xs",
                active && "bg-secondary",
              )}
            >
              <span className="flex flex-col items-center gap-1">
                <Icon />
                {item.label}
              </span>
              {item.href === "/cart" && itemCount > 0 ? (
                <Badge className="absolute right-1 top-0" variant="default">
                  {itemCount}
                </Badge>
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
