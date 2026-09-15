import { ContactIcon, HouseIcon, LayoutGridIcon, type LucideIcon } from "lucide-react"

export type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const navigation: NavigationItem[] = [
  { href: "/", label: "Главная", icon: HouseIcon },
  { href: "/catalog", label: "Каталог", icon: LayoutGridIcon },
  { href: "/contacts", label: "Контакты", icon: ContactIcon },
]

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
}
