import {
  ContactIcon,
  HouseIcon,
  LayoutGridIcon,
  ShoppingBagIcon,
  type LucideIcon,
} from "lucide-react"

export type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const navigation: NavigationItem[] = [
  { href: "/", label: "Главная", icon: HouseIcon },
  { href: "/catalog", label: "Каталог", icon: LayoutGridIcon },
  { href: "/contacts", label: "Контакты", icon: ContactIcon },
  { href: "/cart", label: "Корзина", icon: ShoppingBagIcon },
]

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
}
