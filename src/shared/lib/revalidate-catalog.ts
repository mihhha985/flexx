import "server-only"
import { revalidatePath } from "next/cache"

// The write has already committed. A cache failure must not invite a duplicate submission.
// Category changes also control whether the first product can be created in the admin panel.
export function revalidateCatalog() {
  try {
    revalidatePath("/", "layout")
    revalidatePath("/panel/categories")
    revalidatePath("/panel/products")
  } catch (error) {
    console.error("Не удалось обновить страницы каталога и панели", error)
  }
}
