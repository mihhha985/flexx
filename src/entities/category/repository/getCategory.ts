"use server"

import { db } from "@/src/prisma/db"
import type { Category } from "../domain"

export async function getAllCategory(): Promise<Category[]> {

  try {
    return await db.orm.public.Category
      .select("name", "slug", "order")
      .orderBy((category) => category.order.asc())
      .all()
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await db.orm.public.Category
      .select("name", "slug", "order")
      .where({ slug })
      .first()
  } catch (error) {
    console.error(error);
    throw error
  }
}
