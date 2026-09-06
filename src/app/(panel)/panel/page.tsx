import { redirect } from "next/navigation"
import { requireAdmin } from "@/src/entities/admin/services/sessionService"

export default async function PanelPage() {
  await requireAdmin()
  redirect("/panel/orders")
}
