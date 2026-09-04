"use client"

import { useOptimistic, useTransition } from "react"
import { useRouter, useSelectedLayoutSegment } from "next/navigation"
import { LoaderCircleIcon, SearchIcon } from "lucide-react"

import type { Category } from "@/src/entities/category/domain"
import { cn } from "@/src/shared/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/src/shared/ui/toggle-group"

export function CatalogFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const activeCategory = useSelectedLayoutSegment() ?? "all"
  const [selectedCategory, setSelectedCategory] = useOptimistic(activeCategory)
  const [isPending, startTransition] = useTransition()

  function selectCategory(category: string) {
    if (category === selectedCategory) return

    startTransition(() => {
      setSelectedCategory(category)
      router.push(category === "all" ? "/catalog" : `/catalog/${category}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <InputGroup className="max-w-xl">
        <InputGroupInput
          type="search"
          placeholder="Поиск по товарам"
          aria-label="Поиск по товарам"
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <span role="status" className="flex size-4 items-center justify-center">
            <LoaderCircleIcon
              aria-hidden="true"
              className={cn(
                "motion-safe:animate-spin transition-opacity motion-reduce:transition-none",
                isPending ? "opacity-100 delay-150" : "opacity-0",
              )}
            />
            <span className="sr-only">{isPending ? "Загрузка категории…" : ""}</span>
          </span>
        </InputGroupAddon>
      </InputGroup>

      <div className="overflow-x-auto pb-1">
        <ToggleGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[selectedCategory]}
          onSelectionChange={(keys) => {
            const category = keys.values().next().value
            if (category !== undefined) selectCategory(String(category))
          }}
          variant="outline"
          aria-label="Категория товара"
        >
          <ToggleGroupItem id="all">Все</ToggleGroupItem>
          {categories.map((category) => (
            <ToggleGroupItem key={category.slug} id={category.slug}>
              {category.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
