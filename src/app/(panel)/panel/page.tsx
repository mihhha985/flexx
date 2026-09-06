import { redirect } from "next/navigation"
import { requireAdmin } from "@/src/entities/admin/services/session-service"

export default async function PanelPage() {
  await requireAdmin()
  redirect("/panel/orders")
}
