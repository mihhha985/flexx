import { Fragment } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/shared/ui/pagination"
import {
  getCatalogHref,
  getLastPage,
  type CatalogParams,
} from "@/src/entities/product/catalog-params"

type ProductPaginationProps = {
  totalProducts: number
  pathname?: string
  params: CatalogParams
}

export function ProductPagination({
  totalProducts,
  pathname = "/catalog",
  params,
}: ProductPaginationProps) {
  const totalPages = getLastPage(totalProducts)

  if (totalPages <= 1) {
    return null
  }

  const currentPage = params.page
  const getHref = (page: number) => getCatalogHref(pathname, { ...params, page })
  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getHref(currentPage - 1)} />
          </PaginationItem>
        )}

        {pages.map((page, index) => (
          <Fragment key={page}>
            {index > 0 && page - pages[index - 1] > 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem key={page}>
              <PaginationLink href={getHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          </Fragment>
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
