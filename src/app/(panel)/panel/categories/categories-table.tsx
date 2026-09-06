"use client"

import { useCallback, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"
import type { AdminCategory } from "@/src/entities/category/services/adminCategoryService"
import { deleteCategoryAction } from "@/src/entities/category/actions/manageCategoryActions"
import { DataTable } from "@/src/shared/components/admin/data-table"
import { CatalogRowActions } from "@/src/shared/components/admin/catalog-row-actions"
import { Button } from "@/src/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { CategoryEditDialog } from "./category-edit-dialog"

function getColumns(onEdit: (category: AdminCategory) => void): ColumnDef<AdminCategory>[] {
  return [
    { accessorKey: "name", header: "Название", cell: ({ getValue }) => <span className="block max-w-72 whitespace-normal font-medium">{getValue<string>()}</span> },
    { accessorKey: "slug", header: "Слаг" },
    { accessorKey: "order", header: "Порядок" },
    { accessorKey: "productCount", header: "Товаров" },
    {
      id: "actions", header: () => <span className="sr-only">Действия</span>, enableSorting: false, enableHiding: false,
      cell: ({ row }) => <CatalogRowActions kind="category" name={row.original.name} onEdit={() => onEdit(row.original)} onDelete={() => deleteCategoryAction(row.original.id)} />,
    },
  ]
}

export function CategoriesTable({ data }: { data: AdminCategory[] }) {
  const [editor, setEditor] = useState<AdminCategory | "create" | null>(null)
  const columns = useMemo(() => getColumns(setEditor), [])
  const onOpenChange = useCallback((open: boolean) => { if (!open) setEditor(null) }, [])

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>Категории каталога</CardTitle>
              <CardDescription>Всего категорий: {data.length}</CardDescription>
            </div>
            <Button onPress={() => setEditor("create")}><PlusIcon data-icon="inline-start" />Создать категорию</Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} label="Список категорий" searchLabel="Поиск по категориям" searchPlaceholder="Название или слаг категории…" globalFilterColumns={["name", "slug"]} emptyDescription="Создайте первую категорию, чтобы добавлять в неё товары." />
        </CardContent>
      </Card>
      {editor !== null && <CategoryEditDialog key={editor === "create" ? "create" : editor.id} category={editor === "create" ? undefined : editor} onOpenChange={onOpenChange} />}
    </>
  )
}
