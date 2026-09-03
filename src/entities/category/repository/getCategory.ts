"use server"

import { db } from "@/src/prisma/db";
import { Category } from "../domain";

export async function getAllCategory(): Promise<Category[]> {
  try {
    return await db.orm.public.Category.all();
  } catch (error) {
    throw error;
  }
}
