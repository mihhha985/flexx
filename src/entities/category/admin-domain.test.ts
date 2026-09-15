import assert from "node:assert/strict"
import test from "node:test"
import { categorySchema } from "./admin-domain"

const input = {
  name: "  Nike  ",
  slug: "nike",
  icon: "/category/nike.png",
  order: "2",
}

test("normalizes category fields and excludes client supplied identifiers", () => {
  assert.deepEqual(categorySchema.parse({ ...input, id: "9", productCount: 100 }), {
    name: "Nike",
    slug: "nike",
    icon: "/category/nike.png",
    order: 2,
  })
})

test("rejects invalid category names, addresses and sort positions", () => {
  for (const changes of [
    { name: " " },
    { name: "x".repeat(201) },
    { slug: "" },
    { slug: "Новая категория" },
    { slug: "../catalog" },
    { icon: " " },
    { icon: "electronics" },
    { icon: "../category/nike.png" },
    { icon: "x".repeat(101) },
    { order: "" },
    { order: "-1" },
    { order: "1.5" },
    { order: "Infinity" },
    { order: "2147483648" },
  ]) {
    assert.equal(
      categorySchema.safeParse({ ...input, ...changes }).success,
      false,
      JSON.stringify(changes),
    )
  }
  assert.equal(categorySchema.parse({ ...input, order: "0" }).order, 0)
})
