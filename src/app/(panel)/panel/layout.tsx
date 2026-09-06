import { cookies } from "next/headers"
import { requireAdmin } from "@/src/entities/admin/services/sessionService"
import { AdminSidebar } from "@/src/shared/components/admin/admin-sidebar"
import { AdminBreadcrumbs } from "@/src/shared/components/admin/admin-breadcrumbs"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/src/shared/ui/sidebar"
import { Separator } from "@/src/shared/ui/separator"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false"
  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AdminSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex min-h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
          <SidebarTrigger aria-label="Переключить меню" />
          <Separator orientation="vertical" className="h-4" />
          <AdminBreadcrumbs />
        </header>
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
