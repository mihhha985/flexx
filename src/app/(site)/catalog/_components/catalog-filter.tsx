"use client"

import { useOptimistic, useState, useTransition } from "react"
import { useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation"
import { LoaderCircleIcon, SearchIcon } from "lucide-react"
import { Kbd } from "@/src/shared/ui/kbd"

import type { Category } from "@/src/entities/category/domain"
import { cn } from "@/src/shared/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/src/shared/ui/toggle-group"

export function CatalogFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const activeCategory = useSelectedLayoutSegment() ?? "all"
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useOptimistic(activeCategory)
  const urlSearch = searchParams.get("search") ?? ""
  const [draft, setDraft] = useState<{ url: string; value: string }>({
    url: urlSearch,
    value: urlSearch,
  })
  if (draft.url !== urlSearch) setDraft({ url: urlSearch, value: urlSearch })
  const searchValue = draft.url === urlSearch ? draft.value : urlSearch
  function setSearchValue(value: string) {
    setDraft({ url: urlSearch, value })
  }
  const [isPending, startTransition] = useTransition()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    setSearchValue(value)

    if (value === "" && searchParams.has("search")) {
      startTransition(() => {
        router.push("/catalog")
      })
    }
  }

  function selectCategory(category: string) {
    const shouldNavigate = category !== selectedCategory || searchParams.has("search")
    setSearchValue("")

    if (!shouldNavigate) return

    startTransition(() => {
      setSelectedCategory(category)
      router.push(category === "all" ? "/catalog" : `/catalog/${category}`, { scroll: false })
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      const query = searchValue.trim()

      startTransition(() => {
        const params = new URLSearchParams()
        params.set("search", query)
        router.push(`/catalog?${params.toString()}`)
      })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <InputGroup className="max-w-xl">
        <InputGroupInput
          type="search"
          placeholder="Поиск по товарам"
          aria-label="Поиск по товарам"
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {isPending ? (
            <span role="status" className="flex size-4 items-center justify-center">
              <LoaderCircleIcon
                aria-hidden="true"
                className={cn("motion-safe:animate-spin", "motion-reduce:transition-none")}
              />
              <span className="sr-only">Загрузка товаров…</span>
            </span>
          ) : (
            <Kbd>Enter</Kbd>
          )}
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
