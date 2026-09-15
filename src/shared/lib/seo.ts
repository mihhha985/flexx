export const SITE_NAME = "FLEXX"
export const SITE_DESCRIPTION =
  "Интернет-магазин кроссовок и повседневной обуви с каталогом по брендам и оформлением заказа без регистрации."

export const defaultSocialImage = {
  url: "/images/home-hero-sneaker.png",
  width: 1536,
  height: 1024,
  alt: "Кроссовки в интернет-магазине FLEXX",
} as const

export function toMetaDescription(value: string | undefined, maxLength = 160): string {
  const normalized = value?.replace(/\s+/g, " ").trim() ?? ""
  if (normalized.length <= maxLength) return normalized

  const shortened = normalized.slice(0, maxLength - 1)
  const lastSpace = shortened.lastIndexOf(" ")
  return `${shortened.slice(0, lastSpace > 100 ? lastSpace : undefined)}…`
}
