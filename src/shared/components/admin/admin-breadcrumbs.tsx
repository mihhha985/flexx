"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavigation } from "@/src/shared/config/admin-navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/src/shared/ui/breadcrumb"

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const current = adminNavigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
  return (
    <Breadcrumb aria-label="Навигационная цепочка">
      <BreadcrumbList>
        <BreadcrumbItem>
          {current ? <BreadcrumbLink href="/panel" render={(props) => "href" in props ? <Link {...props} /> : <span {...props} />}>Панель управления</BreadcrumbLink> : <BreadcrumbPage>Панель управления</BreadcrumbPage>}
        </BreadcrumbItem>
        {current && <BreadcrumbItem><BreadcrumbPage>{current.label}</BreadcrumbPage></BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
