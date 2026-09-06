"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardListIcon, PackageIcon, FolderTreeIcon, StoreIcon, LogOutIcon } from "lucide-react"
import { logoutAdmin } from "@/src/entities/admin/services/auth-service"
import { adminNavigation } from "@/src/app/(panel)/panel/_components/admin-navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/src/shared/ui/sidebar"

const icons = { orders: ClipboardListIcon, products: PackageIcon, categories: FolderTreeIcon }

export function AdminSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/panel"
              render={(props) => ("href" in props ? <Link {...props} /> : <span {...props} />)}
              size="lg"
              aria-label="Контур — админ-панель"
              tooltip="Контур — админ-панель"
              onPress={() => setOpenMobile(false)}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                aria-hidden="true"
              >
                <StoreIcon />
              </div>
              <span className="flex min-w-0 flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">Контур</span>
                <span className="truncate text-xs text-muted-foreground">Управление магазином</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Магазин
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu aria-label="Разделы админ-панели">
              {adminNavigation.map((item) => {
                const Icon = icons[item.key]
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      href={item.href}
                      render={(props) =>
                        "href" in props ? <Link {...props} /> : <span {...props} />
                      }
                      isActive={active}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      tooltip={item.label}
                      onPress={() => setOpenMobile(false)}
                    >
                      <Icon aria-hidden="true" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/"
              render={(props) => ("href" in props ? <Link {...props} /> : <span {...props} />)}
              aria-label="Открыть магазин"
              tooltip="Открыть магазин"
            >
              <StoreIcon aria-hidden="true" />
              <span className="group-data-[collapsible=icon]:hidden">Открыть магазин</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logoutAdmin}>
              <SidebarMenuButton type="submit" aria-label="Выйти" tooltip="Выйти">
                <LogOutIcon aria-hidden="true" />
                <span className="group-data-[collapsible=icon]:hidden">Выйти</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
