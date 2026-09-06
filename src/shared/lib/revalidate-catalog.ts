import "server-only"
import { revalidatePath } from "next/cache"

// The write has already committed. A cache failure must not invite a duplicate submission.
export function revalidateCatalog() {
  try {
    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Не удалось обновить страницы каталога", error)
  }
}
