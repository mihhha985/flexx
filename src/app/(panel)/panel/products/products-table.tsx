"use client"

import { useCallback, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { FolderPlusIcon, PackagePlusIcon, PlusIcon } from "lucide-react"
import type { AdminCategory } from "@/src/entities/category/services/admin-category-service"
import type { AdminProduct } from "@/src/entities/product/services/admin-product-service"
import {
  deleteProductAction,
  setProductActive,
} from "@/src/entities/product/services/manage-product-service"
import { DataTable } from "@/src/app/(panel)/panel/_components/data-table"
import { CatalogRowActions } from "@/src/app/(site)/catalog/_components/catalog-row-actions"
import { Badge } from "@/src/shared/ui/badge"
import { Button, LinkButton } from "@/src/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"
import { formatPrice } from "@/src/shared/lib/format-price"
import { ProductEditDialog } from "./product-edit-dialog"

function shortenName(name: string) {
  const characters = Array.from(name)
  return characters.length > 20 ? `${characters.slice(0, 20).join("")}...` : name
}

function getColumns(
  onEdit: (product: AdminProduct) => void,
  categoryNames: Map<number, string>,
): ColumnDef<AdminProduct>[] {
  return [
    { accessorKey: "id", header: "№" },
    {
      accessorKey: "name",
      header: "Название",
      cell: ({ getValue }) => (
        <span
          className="block min-w-40 max-w-72 whitespace-normal font-medium"
          title={getValue<string>()}
          aria-label={getValue<string>()}
        >
          {shortenName(getValue<string>())}
        </span>
      ),
    },
    { accessorKey: "slug", header: "Слаг" },
    {
      id: "category",
      accessorFn: (row) => categoryNames.get(row.categoryId) ?? "—",
      header: "Категория",
    },
    { accessorKey: "price", header: "Цена", cell: ({ row }) => formatPrice(row.original.price) },
    { accessorKey: "stock", header: "Остаток" },
    {
      id: "isActive",
      accessorFn: (row) => (row.isActive ? "В каталоге" : "Скрыт"),
      header: "Статус",
      cell: ({ row, getValue }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {getValue<string>()}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Действия</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <CatalogRowActions
          kind="product"
          name={row.original.name}
          onEdit={() => onEdit(row.original)}
          onDelete={() => deleteProductAction(row.original.id)}
          visibility={{
            isActive: row.original.isActive,
            onChange: () => setProductActive(row.original.id, !row.original.isActive),
          }}
        />
      ),
    },
  ]
}

export function ProductsTable({
  data,
  categories,
}: {
  data: AdminProduct[]
  categories: AdminCategory[]
}) {
  const [editor, setEditor] = useState<AdminProduct | "create" | null>(null)
  const columns = useMemo(
    () =>
      getColumns(setEditor, new Map(categories.map((category) => [category.id, category.name]))),
    [categories],
  )
  const onOpenChange = useCallback((open: boolean) => {
    if (!open) setEditor(null)
  }, [])

  if (!categories.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderPlusIcon />
          </EmptyMedia>
          <EmptyTitle>Сначала создайте категорию</EmptyTitle>
          <EmptyDescription>
            Товару нужна категория. Создайте её, а затем вернитесь сюда, чтобы добавить первый
            товар.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <LinkButton href="/panel/categories">
            <PlusIcon data-icon="inline-start" />
            Создать категорию
          </LinkButton>
        </EmptyContent>
      </Empty>
    )
  }

  if (!data.length) {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackagePlusIcon />
            </EmptyMedia>
            <EmptyTitle>Товаров пока нет</EmptyTitle>
            <EmptyDescription>
              Добавьте первый товар — после сохранения он появится в каталоге.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onPress={() => setEditor("create")}>
              <PlusIcon data-icon="inline-start" />
              Создать товар
            </Button>
          </EmptyContent>
        </Empty>
        {editor !== null && (
          <ProductEditDialog key="create" categories={categories} onOpenChange={onOpenChange} />
        )}
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>Товары каталога</CardTitle>
              <CardDescription>Всего товаров: {data.length}</CardDescription>
            </div>
            <Button onPress={() => setEditor("create")} isDisabled={!categories.length}>
              <PlusIcon data-icon="inline-start" />
              Создать товар
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            label="Список товаров"
            searchLabel="Поиск по товарам"
            searchPlaceholder="Название, слаг, категория или статус…"
            globalFilterColumns={["id", "name", "slug", "category", "isActive"]}
            emptyDescription="Создайте первый товар, чтобы наполнить каталог."
          />
        </CardContent>
      </Card>
      {editor !== null && (
        <ProductEditDialog
          key={editor === "create" ? "create" : editor.id}
          product={editor === "create" ? undefined : editor}
          categories={categories}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  )
}
