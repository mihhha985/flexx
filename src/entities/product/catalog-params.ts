import { z } from "zod"

export const PRODUCTS_PER_PAGE = 12
const first = (value: unknown) => (Array.isArray(value) ? value[0] : value)
const schema = z.object({
  search: z
    .preprocess(first, z.string().trim().max(200).catch(""))
    .transform((value) => value || undefined),
  page: z.preprocess(first, z.coerce.number().int().min(1).max(178956970).catch(1)),
  sort: z.preprocess(first, z.enum(["name", "price"]).catch("name")),
  order: z.preprocess(first, z.enum(["asc", "desc"]).catch("asc")),
})
export type CatalogParams = z.infer<typeof schema>
export function parseCatalogParams(data: unknown): CatalogParams {
  return schema.parse(data ?? {})
}
export function getCatalogHref(pathname: string, params: CatalogParams) {
  const search = new URLSearchParams()
  if (params.search) search.set("search", params.search)
  if (params.sort !== "name") search.set("sort", params.sort)
  if (params.order !== "asc") search.set("order", params.order)
  if (params.page > 1) search.set("page", String(params.page))
  return search.size ? `${pathname}?${search}` : pathname
}
export function getLastPage(total: number) {
  return Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))
}
