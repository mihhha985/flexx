"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ContactIcon,
  HouseIcon,
  LayoutGridIcon,
  PackageIcon,
  ShoppingBagIcon,
} from "lucide-react";

import { useCart } from "@/src/shared/components/cart-provider";
import { cn } from "@/src/shared/lib/utils";
import { Badge } from "@/src/shared/ui/badge";
import { buttonVariants } from "@/src/shared/ui/button";
import { Separator } from "@/src/shared/ui/separator";
import {
  AnimatePresence,
  MotionConfig,
  motion
} from "motion/react";

const navigation = [
  { href: "/", label: "Главная", icon: HouseIcon },
  { href: "/catalog", label: "Каталог", icon: LayoutGridIcon },
  { href: "/contacts", label: "Контакты", icon: ContactIcon },
  { href: "/cart", label: "Корзина", icon: ShoppingBagIcon },
];

const navigationIndicatorTransition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname.startsWith(href);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium"
              aria-label="Контур — на главную"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PackageIcon className="size-4" aria-hidden="true" />
              </span>
              <span>Контур</span>
            </Link>

            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label="Основная навигация"
            >
              {navigation.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "relative isolate",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="desktop-navigation-indicator"
                        className="absolute inset-0 rounded-[min(var(--radius-md),12px)] bg-secondary"
                        transition={navigationIndicatorTransition}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative flex items-center gap-1">
                      <item.icon data-icon="inline-start" />
                      {item.label}
                      {item.href === "/cart" && itemCount > 0 ? (
                        <Badge variant="secondary">{itemCount}</Badge>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/cart"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "md:hidden",
              )}
              aria-label={`Корзина, товаров: ${itemCount}`}
            >
              <ShoppingBagIcon data-icon="inline-start" />
              {itemCount > 0 ? itemCount : "Корзина"}
            </Link>
          </div>
        </header>

        <AnimatePresence initial={false} mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 md:pb-12 md:pt-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <footer className="hidden md:block">
          <Separator />
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
            <p>© 2026 Контур</p>
            <p>Простой способ заказать нужное</p>
          </div>
        </footer>

        <nav
          className="fixed inset-x-0 bottom-0 border-t bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
          aria-label="Мобильная навигация"
        >
          <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
            {navigation.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "relative isolate h-12 flex-col gap-1 px-1 text-xs",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="mobile-navigation-indicator"
                      className="absolute inset-0 rounded-[min(var(--radius-md),12px)] bg-secondary"
                      transition={navigationIndicatorTransition}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative flex flex-col items-center gap-1">
                    <item.icon />
                    {item.label}
                  </span>
                  {item.href === "/cart" && itemCount > 0 ? (
                    <Badge className="absolute right-1 top-0" variant="default">
                      {itemCount}
                    </Badge>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </MotionConfig>
  );
}
