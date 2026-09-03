"use client";
import { useRouter } from "next/navigation";
import { Badge } from "@/src/shared/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/src/shared/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/src/shared/ui/toggle-group"
import { SearchIcon } from "lucide-react"
import type { Category } from "@/src/entities/category/domain"


export function CatalogFilter(
  { categories, productCount }: { categories: Category[]; productCount: number }
) {
  const router = useRouter();

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
          <Badge variant="outline">{productCount}</Badge>
        </InputGroupAddon>
      </InputGroup>

      <div className="overflow-x-auto pb-1">
        <ToggleGroup
          selectionMode="single"
          disallowEmptySelection
          variant="outline"
          aria-label="Категория товара"
        >
          <ToggleGroupItem id="all">Все</ToggleGroupItem>
          {categories.map((item) => (
            <ToggleGroupItem
              key={item.slug}
              id={item.slug}
              onClick={() => router.push(`/catalog?category=${item.slug}`)}
            >
              {item.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
