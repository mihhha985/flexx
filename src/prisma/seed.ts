import { connectDatabase, db } from "./db.ts"

const categories = [
  { name: "Electronics", slug: "electronics", order: 10 },
  { name: "Clothing", slug: "clothing", order: 20 },
  { name: "Home", slug: "home", order: 30 },
  { name: "Beauty", slug: "beauty", order: 40 },
  { name: "Sports", slug: "sports", order: 50 },
] as const

async function main(): Promise<void> {
  await connectDatabase()

  await db.transaction(async (tx) => {
    const seededCategories = []

    for (const category of categories) {
      const seededCategory =
        (await tx.orm.public.Category.where({ slug: category.slug }).first()) ??
        (await tx.orm.public.Category.create(category))

      seededCategories.push(seededCategory)
    }

    for (const [categoryIndex, category] of seededCategories.entries()) {
      for (let index = 1; index <= 10; index++) {
        const slug = `${category.slug}-product-${String(index).padStart(2, "0")}`
        const existing = await tx.orm.public.Product.where({ slug }).select("id").first()
        if (existing) continue
        await tx.orm.public.Product.create({
          name: `${category.name} Product ${index}`,
          slug,
          price: 10 + categoryIndex * 5 + index,
          description: `${category.name} product ${index} description`,
          categoryId: category.id,
          isActive: true,
          stock: 25 + index,
        })
      }
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
