import assert from "node:assert/strict"
import test from "node:test"
import { getCatalogHref, getLastPage, parseCatalogParams } from "./catalog-params"

test("catalog normalizes URL arrays, invalid pages and missing parameters consistently", () => {
  assert.deepEqual(parseCatalogParams(undefined), {
    page: 1,
    sort: "name",
    order: "asc",
  })
  assert.deepEqual(
    parseCatalogParams({ page: ["2", "3"], search: "  чайник  ", sort: "price", order: "desc" }),
    { page: 2, search: "чайник", sort: "price", order: "desc" },
  )
  for (const page of ["0", "-1", "1.5", "Infinity", "invalid", "99999999999999999"])
    assert.equal(parseCatalogParams({ page }).page, 1)
})

test("out of range navigation keeps filters and targets the real last page", () => {
  const params = parseCatalogParams({ page: "999", search: "чайник", sort: "price", order: "desc" })
  assert.equal(getLastPage(24), 2)
  assert.equal(getLastPage(0), 1)
  const href = getCatalogHref("/catalog/home", { ...params, page: getLastPage(24) })
  const url = new URL(href, "https://example.com")
  assert.equal(url.pathname, "/catalog/home")
  assert.equal(url.searchParams.get("page"), "2")
  assert.equal(url.searchParams.get("search"), "чайник")
  assert.equal(url.searchParams.get("sort"), "price")
  assert.equal(getCatalogHref("/catalog", parseCatalogParams({})), "/catalog")
})
