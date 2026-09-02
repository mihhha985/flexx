import { connectDatabase, db } from "./db.ts";

const categories = [
  { name: "Electronics", slug: "electronics", order: 10 },
  { name: "Clothing", slug: "clothing", order: 20 },
  { name: "Home", slug: "home", order: 30 },
  { name: "Beauty", slug: "beauty", order: 40 },
  { name: "Sports", slug: "sports", order: 50 },
] as const;

async function main(): Promise<void> {
  await connectDatabase();

  await db.transaction(async (tx) => {
    await tx.orm.public.OrderItem.where((item) => item.id.gte(0)).deleteAndCount();
    await tx.orm.public.Order.where((order) => order.id.gte(0)).deleteAndCount();
    await tx.orm.public.Product.where((product) => product.id.gte(0)).deleteAndCount();
    await tx.orm.public.Category.where((category) => category.id.gte(0)).deleteAndCount();

    const seededCategories = [];

    for (const category of categories) {
      const seededCategory = await tx.orm.public.Category.create(category);

      seededCategories.push(seededCategory);
    }

    for (const [categoryIndex, category] of seededCategories.entries()) {
      await tx.orm.public.Product.createAll(
        Array.from({ length: 10 }, (_, index) => {
          const productIndex = index + 1;
          const productNumber = String(productIndex).padStart(2, "0");

          return {
            name: `${category.name} Product ${productIndex}`,
            slug: `${category.slug}-product-${productNumber}`,
            price: 10 + categoryIndex * 5 + productIndex,
            description: `${category.name} product ${productIndex} description`,
            categoryId: category.id,
            isActive: true,
            stock: 25 + productIndex,
          };
        }),
      );
    }
  });
}

try {
  await main();
} catch (error: unknown) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await db.close();
}
