export type NavigationIcon = "home" | "catalog" | "contacts" | "cart";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
};

export const navigation: NavigationItem[] = [
  { href: "/", label: "Главная", icon: "home" },
  { href: "/catalog", label: "Каталог", icon: "catalog" },
  { href: "/contacts", label: "Контакты", icon: "contacts" },
  { href: "/cart", label: "Корзина", icon: "cart" },
];
