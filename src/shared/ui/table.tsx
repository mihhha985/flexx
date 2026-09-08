"use client"

import * as React from "react"
import { cn } from "@/src/shared/lib/utils"
import {
  Cell as CellPrimitive,
  Column as ColumnPrimitive,
  Row as RowPrimitive,
  TableBody as TableBodyPrimitive,
  TableFooter as TableFooterPrimitive,
  TableHeader as TableHeaderPrimitive,
  Table as TablePrimitive,
  type CellProps,
  type ColumnProps,
  type RowProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableHeaderProps,
  type TableProps,
} from "react-aria-components"

function Table({ className, ...props }: TableProps) {
  return (
    <div data-slot="table-container" className="relative w-full min-w-0 overflow-x-auto">
      <TablePrimitive
        data-slot="table"
        className={cn("ui-focus w-full caption-bottom text-sm/5", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader<T>({ className, ...props }: TableHeaderProps<T>) {
  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={cn("bg-muted [&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody<T>({ className, ...props }: TableBodyProps<T>) {
  return (
    <TableBodyPrimitive
      data-slot="table-body"
      className={cn("data-empty:h-24 data-empty:text-center [&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter<T>({ className, ...props }: TableFooterProps<T>) {
  return (
    <TableFooterPrimitive
      data-slot="table-footer"
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
}

function TableRow<T>({ className, ...props }: RowProps<T>) {
  return (
    <RowPrimitive
      data-slot="table-row"
      className={cn(
        "ui-focus border-b transition-colors duration-150 focus-visible:-outline-offset-2 data-focus-visible:-outline-offset-2 hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted data-selected:bg-muted",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ColumnProps) {
  return (
    <ColumnPrimitive
      data-slot="table-head"
      className={cn(
        "ui-focus h-12 px-4 focus-visible:-outline-offset-2 data-focus-visible:-outline-offset-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: CellProps) {
  return (
    <CellPrimitive
      data-slot="table-cell"
      className={cn(
        "ui-focus px-4 py-3 align-middle tabular-nums focus-visible:-outline-offset-2 data-focus-visible:-outline-offset-2 whitespace-nowrap [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="table-caption"
      className={cn("mt-4 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
