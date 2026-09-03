"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ContactIcon,
  HouseIcon,
  LayoutGridIcon,
  PackageIcon,
  ShoppingBagIcon,
} from "lucide-react"

import { useCart } from "@/src/shared/components/cart-provider"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { buttonVariants } from "@/src/shared/ui/button"
import { Separator } from "@/src/shared/ui/separator"

const navigation = [
  { href: "/", label: "Главная", icon: HouseIcon },
  { href: "/catalog", label: "Каталог", icon: LayoutGridIcon },
  { href: "/contacts", label: "Контакты", icon: ContactIcon },
  { href: "/cart", label: "Корзина", icon: ShoppingBagIcon },
]

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === href
  return pathname.startsWith(href)
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-medium" aria-label="Контур — на главную">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PackageIcon className="size-4" aria-hidden="true" />
            </span>
            <span>Контур</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
            {navigation.map((item) => {
              const active = isActiveRoute(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(buttonVariants({ variant: active ? "secondary" : "ghost", size: "sm" }))}
                >
                  <item.icon data-icon="inline-start" />
                  {item.label}
                  {item.href === "/cart" && itemCount > 0 ? (
                    <Badge variant="secondary">{itemCount}</Badge>
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <Link
            href="/cart"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "md:hidden")}
            aria-label={`Корзина, товаров: ${itemCount}`}
          >
            <ShoppingBagIcon data-icon="inline-start" />
            {itemCount > 0 ? itemCount : "Корзина"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 md:pb-12 md:pt-10">{children}</main>

      <footer className="hidden md:block">
        <Separator />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <p>© 2026 Контур</p>
          <p>Простой способ заказать нужное</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 border-t bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden" aria-label="Мобильная навигация">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navigation.map((item) => {
            const active = isActiveRoute(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: active ? "secondary" : "ghost", size: "sm" }),
                  "relative h-12 flex-col gap-1 px-1 text-xs",
                )}
              >
                <item.icon />
                {item.label}
                {item.href === "/cart" && itemCount > 0 ? (
                  <Badge className="absolute right-1 top-0" variant="default">{itemCount}</Badge>
                ) : null}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
