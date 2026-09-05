import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/shared/ui/pagination"
import { LIMIT } from "@/src/entities/product/domain";

type ProductPaginationSearchParams = Record<
  string,
  string | string[] | undefined
>

type ProductPaginationProps = {
  totalProducts: number
  pathname?: string
  searchParams?: ProductPaginationSearchParams
}

function getCurrentPage(value: string | string[] | undefined): number {
  const page = Number(Array.isArray(value) ? value[0] : value)

  return Number.isInteger(page) && page > 0 ? page : 1
}

export function ProductPagination({
  totalProducts,
  pathname = "/catalog",
  searchParams = {},
}: ProductPaginationProps) {
  const totalPages = Math.ceil(totalProducts / LIMIT)

  if (totalPages <= 1) {
    return null
  }

  const currentPage = Math.min(getCurrentPage(searchParams.page), totalPages)
  const getHref = (page: number) => {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) {
        continue
      }

      for (const item of Array.isArray(value) ? value : [value]) {
        params.append(key, item)
      }
    }

    params.set("page", String(page))

    return `${pathname}?${params.toString()}`
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getHref(currentPage - 1)} />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={getHref(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={getHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
