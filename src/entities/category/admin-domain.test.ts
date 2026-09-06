import assert from "node:assert/strict"
import test from "node:test"
import { categorySchema } from "./admin-domain"

const input = { name: "  Техника  ", slug: "home-tech", order: "2" }

test("normalizes category fields and excludes client supplied identifiers", () => {
  assert.deepEqual(categorySchema.parse({ ...input, id: "9", productCount: 100 }), {
    name: "Техника", slug: "home-tech", order: 2,
  })
})

test("rejects invalid category names, addresses and sort positions", () => {
  for (const changes of [
    { name: " " }, { name: "x".repeat(201) }, { slug: "" }, { slug: "Новая категория" },
    { slug: "../catalog" }, { order: "" }, { order: "-1" }, { order: "1.5" },
    { order: "Infinity" }, { order: "2147483648" },
  ]) {
    assert.equal(categorySchema.safeParse({ ...input, ...changes }).success, false, JSON.stringify(changes))
  }
  assert.equal(categorySchema.parse({ ...input, order: "0" }).order, 0)
})
