"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/src/shared/components/cart-provider";
import { cn } from "@/src/shared/lib/utils";
import { Badge } from "@/src/shared/ui/badge";
import { buttonVariants } from "@/src/shared/ui/button";
import {
  ContactIcon,
  HouseIcon,
  LayoutGridIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { navigation, NavigationIcon } from "@/src/shared/config/navigation";

const icons: Record<NavigationIcon, typeof HouseIcon> = {
  home: HouseIcon,
  catalog: LayoutGridIcon,
  contacts: ContactIcon,
  cart: ShoppingBagIcon,
};

export default function Menu() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <>
      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label="Основная навигация"
      >
        {navigation.map((item) => {
          const active = pathname === item.href;
          const Icon = icons[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                active && "bg-secondary",
              )}
            >
              <span className="flex items-center gap-1">
                <Icon data-icon="inline-start" />
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
    </>
  );
}
