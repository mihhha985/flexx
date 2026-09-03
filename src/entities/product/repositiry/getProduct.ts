"use server"

import { db } from "@/src/prisma/db"
import type { ProductWithCategory } from "../domain"

function getActiveProductsQuery() {
  return db.orm.public.Product
    .select("id", "name", "slug", "stock", "price", "imageUrl", "isActive")
    .include("category", (category) => category.select("name", "slug", "order"))
    .where({ "isActive": true })
    .orderBy((product) => product.name.asc());
}

export async function getAllProducts(category?: string,limit: number = 12, offset: number = 0): Promise<ProductWithCategory[]> {
  try {
    const products = getActiveProductsQuery();

    return await (category
      ? products.where((product) => product.category.some({ slug: category }))
      : products)
      .limit(limit)
      .offset(offset)
      .all();
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getAllActiveProducts(): Promise<ProductWithCategory[]> {
  try {
    return await getActiveProductsQuery().all()
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  try {
    return await db.orm.public.Product
      .select("id", "name", "slug", "stock", "price", "imageUrl", "description", "isActive")
      .include("category", (category) => category.select("name", "slug", "order"))
      .where({ "isActive": true, "slug": slug })
      .first()
  } catch (error) {
    console.error(error);
    throw error
  }
}
