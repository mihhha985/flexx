"use client"

import { useCallback, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import type { AdminCategory } from "@/src/entities/category/services/adminCategoryService"
import type { AdminProduct } from "@/src/entities/product/services/adminProductService"
import { deleteProductAction, setProductActive } from "@/src/entities/product/actions/manageProductActions"
import { DataTable } from "@/src/shared/components/admin/data-table"
import { CatalogRowActions } from "@/src/shared/components/admin/catalog-row-actions"
import { Badge } from "@/src/shared/ui/badge"
import { Button } from "@/src/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { formatPrice } from "@/src/shared/lib/catalog"
import { ProductEditDialog } from "./product-edit-dialog"

function getColumns(onEdit: (product: AdminProduct) => void): ColumnDef<AdminProduct>[] {
  return [
    { accessorKey: "name", header: "Название", cell: ({ getValue }) => <span className="block min-w-40 max-w-72 whitespace-normal font-medium">{getValue<string>()}</span> },
    { accessorKey: "slug", header: "Слаг" },
    { accessorKey: "categoryName", header: "Категория" },
    { accessorKey: "price", header: "Цена", cell: ({ row }) => formatPrice(row.original.price) },
    { accessorKey: "stock", header: "Остаток" },
    { id: "isActive", accessorFn: (row) => row.isActive ? "В каталоге" : "Скрыт", header: "Статус", cell: ({ row, getValue }) => <Badge variant={row.original.isActive ? "default" : "secondary"}>{getValue<string>()}</Badge> },
    {
      id: "actions", header: () => <span className="sr-only">Действия</span>, enableSorting: false, enableHiding: false,
      cell: ({ row }) => <CatalogRowActions kind="product" name={row.original.name} onEdit={() => onEdit(row.original)} onDelete={() => deleteProductAction(row.original.id)} visibility={{ isActive: row.original.isActive, onChange: () => setProductActive(row.original.id, !row.original.isActive) }} />,
    },
  ]
}

export function ProductsTable({ data, categories }: { data: AdminProduct[]; categories: AdminCategory[] }) {
  const [editor, setEditor] = useState<AdminProduct | "create" | null>(null)
  const columns = useMemo(() => getColumns(setEditor), [])
  const onOpenChange = useCallback((open: boolean) => { if (!open) setEditor(null) }, [])

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>Товары каталога</CardTitle>
              <CardDescription>Всего товаров: {data.length}</CardDescription>
            </div>
            <Button onPress={() => setEditor("create")} isDisabled={!categories.length}><PlusIcon data-icon="inline-start" />Создать товар</Button>
          </div>
          {!categories.length && <CardDescription>Для создания товара сначала <Link href="/panel/categories" className="underline underline-offset-4">создайте категорию</Link>.</CardDescription>}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} label="Список товаров" searchLabel="Поиск по товарам" searchPlaceholder="Название, слаг, категория или статус…" globalFilterColumns={["name", "slug", "categoryName", "isActive"]} emptyDescription="Создайте первый товар, чтобы наполнить каталог." />
        </CardContent>
      </Card>
      {editor !== null && <ProductEditDialog key={editor === "create" ? "create" : editor.id} product={editor === "create" ? undefined : editor} categories={categories} onOpenChange={onOpenChange} />}
    </>
  )
}
