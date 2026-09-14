import { connectDatabase, db } from "./db.ts"

const categories = [
  { name: "Puma", slug: "puma", icon: "/category/puma.png", order: 10 },
  { name: "Adidas", slug: "adidas", icon: "/category/adidas.webp", order: 20 },
  { name: "Nike", slug: "nike", icon: "/category/nike.png", order: 30 },
  { name: "Jordan", slug: "jordan", icon: "/category/jordan.webp", order: 40 },
  { name: "New Balance", slug: "new-balance", icon: "/category/newbalance.webp", order: 50 },
] as const

async function main(): Promise<void> {
  await connectDatabase()

  await db.transaction(async (tx) => {
    for (const category of categories) {
      const existing = await tx.orm.public.Category.where({ slug: category.slug })
        .select("id")
        .first()
      if (existing) continue

      await tx.orm.public.Category.create(category)
    }
  })
}

try {
  await main()
} catch (error: unknown) {
  console.error(error)
  process.exitCode = 1
} finally {
  await db.close()
}
