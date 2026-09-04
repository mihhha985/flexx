import type { Metadata } from "next"

import { CatalogResults } from "@/src/shared/components/catalog-results"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Каталог товаров — Контур",
  description: "Каталог товаров с быстрым поиском и фильтрацией по категориям.",
  alternates: {
    canonical: "/catalog",
  },
}

export default function CatalogPage() {
  return <CatalogResults />
}
