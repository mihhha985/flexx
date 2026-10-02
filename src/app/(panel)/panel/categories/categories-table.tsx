"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import type { ColumnDef } from "@tanstack/react-table"
import { FolderPlusIcon, PlusIcon } from "lucide-react"
import type { AdminCategory } from "@/src/entities/category/services/admin-category-service"
import { deleteCategoryAction } from "@/src/entities/category/services/manage-category-service"
import { DataTable } from "@/src/app/(panel)/panel/_components/data-table"
import { AdminRowActions } from "@/src/app/(panel)/panel/_components/admin-row-actions"
import { Button } from "@/src/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"
import { CategoryEditDialog } from "./category-edit-dialog"

function getColumns(onEdit: (category: AdminCategory) => void): ColumnDef<AdminCategory>[] {
  return [
    {
      accessorKey: "name",
      header: "Название",
      cell: ({ getValue }) => (
        <span className="block max-w-72 whitespace-normal font-medium">{getValue<string>()}</span>
      ),
    },
    { accessorKey: "slug", header: "Слаг" },
    {
      accessorKey: "icon",
      header: "Изображение",
      enableSorting: false,
      cell: ({ row }) =>
        row.original.icon.startsWith("/") ? (
          <Image
            src={row.original.icon}
            alt={row.original.name}
            width={48}
            height={48}
            className="size-12 rounded-lg bg-muted object-contain p-1"
          />
        ) : (
          <span className="text-muted-foreground">Фото пока нет</span>
        ),
    },
    { accessorKey: "order", header: "Порядок" },
    { accessorKey: "productCount", header: "Товаров" },
    {
      id: "actions",
      header: () => <span className="sr-only">Действия</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <AdminRowActions
          kind="category"
          name={row.original.name}
          onEdit={() => onEdit(row.original)}
          onDelete={() => deleteCategoryAction(row.original.id)}
        />
      ),
    },
  ]
}

export function CategoriesTable({ data }: { data: AdminCategory[] }) {
  const [editor, setEditor] = useState<AdminCategory | "create" | null>(null)
  const columns = useMemo(() => getColumns(setEditor), [])
  const onOpenChange = useCallback((open: boolean) => {
    if (!open) setEditor(null)
  }, [])

  if (!data.length) {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Категорий пока нет</EmptyTitle>
            <EmptyDescription>
              Создайте первую категорию, чтобы добавлять в неё товары.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onPress={() => setEditor("create")}>
              <PlusIcon data-icon="inline-start" />
              Создать категорию
            </Button>
          </EmptyContent>
        </Empty>
        {editor !== null && <CategoryEditDialog key="create" onOpenChange={onOpenChange} />}
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>Категории каталога</CardTitle>
              <CardDescription>Всего категорий: {data.length}</CardDescription>
            </div>
            <Button onPress={() => setEditor("create")}>
              <PlusIcon data-icon="inline-start" />
              Создать категорию
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            label="Список категорий"
            searchLabel="Поиск по категориям"
            searchPlaceholder="Название или слаг категории…"
            globalFilterColumns={["name", "slug"]}
            emptyDescription="Создайте первую категорию, чтобы добавлять в неё товары."
          />
        </CardContent>
      </Card>
      {editor !== null && (
        <CategoryEditDialog
          key={editor === "create" ? "create" : editor.id}
          category={editor === "create" ? undefined : editor}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  )
}
