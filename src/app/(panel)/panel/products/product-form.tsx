"use client"

import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownIcon, ArrowUpIcon, ImagePlusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import type { AdminCategory } from "@/src/entities/category/services/admin-category-service"
import {
  MAX_PRODUCT_IMAGES,
  MAX_PRODUCT_VARIANTS,
  productSizes,
} from "@/src/entities/product/domain"
import type { AdminProduct } from "@/src/entities/product/services/admin-product-service"
import { createProductAction } from "@/src/entities/product/services/manage-product-service"
import { updateProductAction } from "@/src/entities/product/services/update-product-service"
import { Button, LinkButton } from "@/src/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"
import { Textarea } from "@/src/shared/ui/textarea"

type ProductFormProps = {
  product?: AdminProduct
  categories: AdminCategory[]
}

type SizeDraft = { size: number; stock: number }
type VariantDraft = {
  key: string
  id?: number
  colorName: string
  colorSlug: string
  colorHex: string
  price: string
  isActive: boolean
  avatar?: string
  images: string[]
  pendingImagesCount: number
  sizes: SizeDraft[]
}

function newVariant(key: string): VariantDraft {
  return {
    key,
    colorName: "",
    colorSlug: "",
    colorHex: "#000000",
    price: "0",
    isActive: true,
    images: [],
    pendingImagesCount: 0,
    sizes: [],
  }
}

function initialVariants(product: AdminProduct | undefined): VariantDraft[] {
  if (!product) return [newVariant("variant-0")]
  return product.variants.map((variant) => ({
    key: `variant-${variant.id}`,
    id: variant.id,
    colorName: variant.colorName,
    colorSlug: variant.colorSlug,
    colorHex: variant.colorHex,
    price: String(variant.price),
    isActive: variant.isActive,
    avatar: variant.avatar,
    images: [...variant.images],
    pendingImagesCount: 0,
    sizes: variant.sizes.map((item) => ({ size: item.size, stock: item.stock })),
  }))
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const nextVariantKey = useRef(1)
  const [variants, setVariants] = useState(() => initialVariants(product))
  const initialPrimary = product?.variants.find((variant) => variant.order === 0)
  const [primaryKey, setPrimaryKey] = useState(
    initialPrimary ? `variant-${initialPrimary.id}` : "variant-0",
  )
  const [state, action, pending] = useActionState(
    product ? updateProductAction : createProductAction,
    {},
  )

  useEffect(() => {
    if (!state.success) return
    router.push(`/panel/products?saved=${product ? "updated" : "created"}`)
  }, [product, router, state.success])

  function updateVariant(key: string, update: Partial<VariantDraft>) {
    setVariants((current) =>
      current.map((variant) => (variant.key === key ? { ...variant, ...update } : variant)),
    )
  }

  function removeVariant(key: string) {
    setVariants((current) => {
      if (current.length === 1) return current
      const next = current.filter((variant) => variant.key !== key)
      if (primaryKey === key) setPrimaryKey(next[0].key)
      return next
    })
  }

  function moveVariant(index: number, direction: -1 | 1) {
    setVariants((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function addSize(key: string, size: number) {
    setVariants((current) =>
      current.map((variant) =>
        variant.key !== key || variant.sizes.some((item) => item.size === size)
          ? variant
          : {
              ...variant,
              sizes: [...variant.sizes, { size, stock: 0 }].sort(
                (left, right) => left.size - right.size,
              ),
            },
      ),
    )
  }

  const primaryIndex = Math.max(
    0,
    variants.findIndex((variant) => variant.key === primaryKey),
  )

  return (
    <form
      encType="multipart/form-data"
      aria-busy={pending}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (pending) return
        startTransition(() => action(new FormData(event.currentTarget)))
      }}
    >
      <input type="hidden" name="variantCount" value={variants.length} />
      <input type="hidden" name="primaryVariant" value={primaryIndex} />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Данные товара</CardTitle>
          <CardDescription>
            Общие сведения задаются один раз, а цена, фотографии и остатки настраиваются для каждого
            цвета отдельно.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(state.errors?.name)}>
              <FieldLabel htmlFor="product-name">Название</FieldLabel>
              <Input
                autoFocus
                id="product-name"
                name="name"
                defaultValue={product?.name ?? ""}
                maxLength={200}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.name)}
                required
              />
              <FieldError>{state.errors?.name?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.slug)}>
              <FieldLabel htmlFor="product-slug">Адрес в каталоге (слаг)</FieldLabel>
              <Input
                id="product-slug"
                name="slug"
                defaultValue={product?.slug ?? ""}
                maxLength={200}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.slug)}
                required
              />
              <FieldError>{state.errors?.slug?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.categoryId)}>
              <FieldLabel htmlFor="product-category">Категория</FieldLabel>
              <select
                id="product-category"
                name="categoryId"
                defaultValue={String(product?.categoryId ?? categories[0]?.id ?? "")}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.categoryId)}
                className="ui-focus h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base outline-none disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FieldError>{state.errors?.categoryId?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.country)}>
              <FieldLabel htmlFor="product-country">Страна-производитель</FieldLabel>
              <Input
                id="product-country"
                name="country"
                defaultValue={product?.country ?? ""}
                maxLength={200}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.country)}
                required
              />
              <FieldError>{state.errors?.country?.[0]}</FieldError>
            </Field>
            <Field className="sm:col-span-2" data-invalid={Boolean(state.errors?.description)}>
              <FieldLabel htmlFor="product-description">Описание</FieldLabel>
              <Textarea
                id="product-description"
                name="description"
                defaultValue={product?.description ?? ""}
                maxLength={10000}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.description)}
                required
              />
              <FieldError>{state.errors?.description?.[0]}</FieldError>
            </Field>
          </FieldGroup>
        </CardContent>

        <section className="border-t" aria-labelledby="product-variants-title">
          <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-5">
            <div>
              <h2 id="product-variants-title" className="font-semibold">
                Цвета и размеры
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Основной цвет с порядком 0 показывается в каталоге.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              isDisabled={pending || variants.length >= MAX_PRODUCT_VARIANTS}
              onPress={() => {
                const variant = newVariant(`new-${nextVariantKey.current++}`)
                setVariants((current) => [...current, variant])
              }}
            >
              <PlusIcon data-icon="inline-start" /> Добавить цвет
            </Button>
          </div>
          <FieldError className="px-6 pb-3">{state.errors?.variants?.[0]}</FieldError>

          {variants.map((variant, index) => {
            const errors = state.variantErrors?.[index]
            const availableSizes = productSizes.filter(
              (size) => !variant.sizes.some((item) => item.size === size),
            )
            return (
              <fieldset key={variant.key} className="border-t px-6 py-6">
                <legend className="sr-only">Цвет {index + 1}</legend>
                {variant.id ? (
                  <input type="hidden" name={`variants.${index}.id`} value={variant.id} />
                ) : null}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="size-8 rounded-md border border-border"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    <div>
                      <p className="font-medium">{variant.colorName || `Цвет ${index + 1}`}</p>
                      <label className="mt-1 flex min-h-11 items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="primaryVariantControl"
                          checked={primaryKey === variant.key}
                          disabled={pending}
                          onChange={() => {
                            setPrimaryKey(variant.key)
                            updateVariant(variant.key, { isActive: true })
                          }}
                        />
                        Основной цвет
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Переместить цвет выше"
                      isDisabled={pending || index === 0}
                      onPress={() => moveVariant(index, -1)}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Переместить цвет ниже"
                      isDisabled={pending || index === variants.length - 1}
                      onPress={() => moveVariant(index, 1)}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Удалить цвет"
                      isDisabled={pending || variants.length === 1}
                      onPress={() => removeVariant(variant.key)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>

                <FieldGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Field data-invalid={Boolean(errors?.colorName)}>
                    <FieldLabel htmlFor={`variant-${variant.key}-name`}>Название цвета</FieldLabel>
                    <Input
                      id={`variant-${variant.key}-name`}
                      name={`variants.${index}.colorName`}
                      value={variant.colorName}
                      onChange={(event) =>
                        updateVariant(variant.key, { colorName: event.target.value })
                      }
                      maxLength={100}
                      disabled={pending}
                      required
                    />
                    <FieldError>{errors?.colorName?.[0]}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(errors?.colorSlug)}>
                    <FieldLabel htmlFor={`variant-${variant.key}-slug`}>Слаг цвета</FieldLabel>
                    <Input
                      id={`variant-${variant.key}-slug`}
                      name={`variants.${index}.colorSlug`}
                      value={variant.colorSlug}
                      onChange={(event) =>
                        updateVariant(variant.key, { colorSlug: event.target.value })
                      }
                      maxLength={100}
                      disabled={pending}
                      required
                    />
                    <FieldError>{errors?.colorSlug?.[0]}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(errors?.colorHex)}>
                    <FieldLabel htmlFor={`variant-${variant.key}-hex`}>Цвет</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id={`variant-${variant.key}-picker`}
                        type="color"
                        value={variant.colorHex}
                        onChange={(event) =>
                          updateVariant(variant.key, { colorHex: event.target.value.toUpperCase() })
                        }
                        disabled={pending}
                        className="w-14 shrink-0 p-1"
                        aria-label="Выбрать цвет"
                      />
                      <Input
                        id={`variant-${variant.key}-hex`}
                        name={`variants.${index}.colorHex`}
                        value={variant.colorHex}
                        onChange={(event) =>
                          updateVariant(variant.key, { colorHex: event.target.value })
                        }
                        maxLength={7}
                        disabled={pending}
                        required
                      />
                    </div>
                    <FieldError>{errors?.colorHex?.[0]}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(errors?.price)}>
                    <FieldLabel htmlFor={`variant-${variant.key}-price`}>Цена</FieldLabel>
                    <Input
                      id={`variant-${variant.key}-price`}
                      name={`variants.${index}.price`}
                      type="number"
                      value={variant.price}
                      onChange={(event) =>
                        updateVariant(variant.key, { price: event.target.value })
                      }
                      min="0"
                      max="999999999.99"
                      step="0.01"
                      disabled={pending}
                      required
                    />
                    <FieldError>{errors?.price?.[0]}</FieldError>
                  </Field>
                </FieldGroup>

                <label className="mt-4 flex min-h-11 items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    name={`variants.${index}.isActive`}
                    checked={variant.isActive}
                    disabled={pending || primaryKey === variant.key}
                    onChange={(event) =>
                      updateVariant(variant.key, { isActive: event.target.checked })
                    }
                  />
                  Показывать этот цвет покупателям
                </label>
                <FieldError>{errors?.isActive?.[0]}</FieldError>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <Field data-invalid={Boolean(errors?.avatar)}>
                    <FieldLabel htmlFor={`variant-${variant.key}-avatar`}>
                      Главное изображение
                    </FieldLabel>
                    <Input
                      id={`variant-${variant.key}-avatar`}
                      name={`variants.${index}.avatar`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={pending}
                      aria-required={!variant.avatar}
                    />
                    {variant.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={variant.avatar}
                        alt={`Главное изображение цвета ${variant.colorName}`}
                        className="aspect-square w-24 rounded-md border border-border bg-muted object-contain p-2"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">JPG, PNG или WebP, до 5 МБ.</p>
                    )}
                    <FieldError>{errors?.avatar?.[0]}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(errors?.images)}>
                    <FieldLabel htmlFor={`variant-${variant.key}-images`}>
                      Дополнительные изображения
                    </FieldLabel>
                    <Input
                      id={`variant-${variant.key}-images`}
                      name={`variants.${index}.images`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={pending}
                      onChange={(event) => {
                        const filesCount = event.currentTarget.files?.length ?? 0
                        const availableSlots = MAX_PRODUCT_IMAGES - variant.images.length
                        if (filesCount > availableSlots) {
                          event.currentTarget.value = ""
                          updateVariant(variant.key, { pendingImagesCount: 0 })
                          toast.error(
                            `Можно выбрать ещё не больше ${availableSlots} изображений для этого цвета.`,
                          )
                          return
                        }
                        updateVariant(variant.key, { pendingImagesCount: filesCount })
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG или WebP, до 5 МБ каждое. Всего до {MAX_PRODUCT_IMAGES} изображений
                      для этого цвета.
                    </p>
                    {variant.pendingImagesCount ? (
                      <p className="text-sm text-muted-foreground" aria-live="polite">
                        Выбрано новых: {variant.pendingImagesCount}. После сохранения:{" "}
                        {variant.images.length + variant.pendingImagesCount} из {MAX_PRODUCT_IMAGES}
                        .
                      </p>
                    ) : null}
                    {variant.images.length ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {variant.images.map((image, imageIndex) => (
                          <div key={image} className="flex min-w-0 flex-col gap-1">
                            <input
                              type="hidden"
                              name={`variants.${index}.retainedImage`}
                              value={image}
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={`Изображение ${imageIndex + 1} цвета ${variant.colorName}`}
                              className="aspect-square w-full rounded-md border border-border object-contain p-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              isDisabled={pending}
                              onPress={() =>
                                updateVariant(variant.key, {
                                  images: variant.images.filter((current) => current !== image),
                                })
                              }
                            >
                              <Trash2Icon data-icon="inline-start" /> Удалить
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImagePlusIcon className="size-4" /> Галерея пока пуста
                      </div>
                    )}
                    <FieldError>{errors?.images?.[0]}</FieldError>
                  </Field>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Размеры и остатки</p>
                      <p className="mt-1 text-sm text-muted-foreground">Система размеров: EU.</p>
                    </div>
                    <select
                      value=""
                      disabled={pending || !availableSizes.length}
                      onChange={(event) => {
                        if (event.target.value) addSize(variant.key, Number(event.target.value))
                      }}
                      aria-label={`Добавить размер для цвета ${variant.colorName || index + 1}`}
                      className="ui-focus h-11 rounded-md border border-input bg-background px-3 text-sm outline-none disabled:bg-muted disabled:opacity-50"
                    >
                      <option value="">Добавить размер</option>
                      {availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  {variant.sizes.length ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {variant.sizes.map((item) => (
                        <div
                          key={item.size}
                          className="flex min-w-0 items-end gap-2 rounded-md border border-border p-3"
                        >
                          <input type="hidden" name={`variants.${index}.size`} value={item.size} />
                          <Field className="min-w-0 flex-1">
                            <FieldLabel htmlFor={`variant-${variant.key}-stock-${item.size}`}>
                              Размер {item.size}
                            </FieldLabel>
                            <Input
                              id={`variant-${variant.key}-stock-${item.size}`}
                              name={`variants.${index}.stock`}
                              type="number"
                              value={item.stock}
                              min="0"
                              step="1"
                              disabled={pending}
                              onChange={(event) =>
                                updateVariant(variant.key, {
                                  sizes: variant.sizes.map((current) =>
                                    current.size === item.size
                                      ? { ...current, stock: Number(event.target.value) }
                                      : current,
                                  ),
                                })
                              }
                              required
                            />
                          </Field>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Удалить размер ${item.size}`}
                            isDisabled={pending}
                            onPress={() =>
                              updateVariant(variant.key, {
                                sizes: variant.sizes.filter(
                                  (current) => current.size !== item.size,
                                ),
                              })
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Добавьте хотя бы один размер.
                    </p>
                  )}
                  <FieldError className="mt-2">{errors?.sizes?.[0]}</FieldError>
                </div>
              </fieldset>
            )
          })}
        </section>

        <CardContent>
          <FieldError>{!state.success && state.message}</FieldError>
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <LinkButton href="/panel/products" variant="outline" isDisabled={pending}>
            Отмена
          </LinkButton>
          <Button type="submit" isDisabled={pending || !categories.length}>
            {pending ? "Сохраняем…" : product ? "Сохранить изменения" : "Создать товар"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
