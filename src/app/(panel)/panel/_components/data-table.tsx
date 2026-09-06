"use client"

import { useId, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/src/shared/ui/button"
import { Field, FieldLabel } from "@/src/shared/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/src/shared/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/ui/table"

type DataTableProps<TData extends { id: number }> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  label: string
  searchPlaceholder: string
  emptyDescription: string
  searchLabel?: string
  globalFilterColumns?: string[]
}

export function DataTable<TData extends { id: number }>({
  columns,
  data,
  label,
  searchPlaceholder,
  emptyDescription,
  searchLabel = "Поиск",
  globalFilterColumns,
}: DataTableProps<TData>) {
  const searchId = useId()
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  // TanStack v8 owns mutable table state; this component must not be compiler-memoized.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getColumnCanGlobalFilter: (column) =>
      !globalFilterColumns || globalFilterColumns.includes(column.id),
    globalFilterFn: (row, columnId, value: string) =>
      String(row.getValue(columnId) ?? "")
        .toLocaleLowerCase("ru")
        .includes(value.trim().toLocaleLowerCase("ru")),
    state: { sorting, globalFilter: search },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })
  const count = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const sort = sorting[0]

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Field className="max-w-md">
        <FieldLabel htmlFor={searchId}>{searchLabel}</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id={searchId}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              table.setPageIndex(0)
            }}
          />
        </InputGroup>
      </Field>
      <div className="overflow-hidden rounded-lg border">
        <Table
          aria-label={label}
          sortDescriptor={
            sort
              ? { column: sort.id, direction: sort.desc ? "descending" : "ascending" }
              : undefined
          }
          onSortChange={({ column, direction }) =>
            setSorting([{ id: String(column), desc: direction === "descending" }])
          }
        >
          <TableHeader>
            {table.getFlatHeaders().map((header, index) => (
              <TableHead
                key={header.id}
                id={header.id}
                isRowHeader={index === 0}
                allowsSorting={header.column.getCanSort()}
              >
                <span className="inline-flex items-center gap-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() &&
                    (header.column.getIsSorted() === "asc" ? (
                      <ArrowUpIcon className="size-3.5" aria-hidden="true" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ArrowDownIcon className="size-3.5" aria-hidden="true" />
                    ) : (
                      <ArrowUpDownIcon className="size-3.5" aria-hidden="true" />
                    ))}
                </span>
              </TableHead>
            ))}
          </TableHeader>
          <TableBody
            renderEmptyState={() => (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{search ? "Ничего не найдено" : "Список пока пуст"}</EmptyTitle>
                  <EmptyDescription>
                    {search ? "Попробуйте изменить поисковый запрос." : emptyDescription}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          >
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} id={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {count
            ? `${pageIndex * pageSize + 1}–${Math.min((pageIndex + 1) * pageSize, count)} из ${count}`
            : "0 записей"}
          {search && ` · Всего: ${data.length}`}
        </p>
        <div className="flex items-center gap-3" aria-label="Страницы таблицы">
          <span className="text-sm text-muted-foreground">
            Страница {pageIndex + 1} из {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Предыдущая страница"
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Следующая страница"
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
