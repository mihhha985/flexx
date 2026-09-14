"use client"

import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Button as AriaButton,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ComboBox,
  Input as AriaInput,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components"
import { CheckIcon, ChevronDownIcon, Trash2Icon, XIcon } from "lucide-react"
import { createProductAction } from "@/src/entities/product/services/manage-product-service"
import { updateProductAction } from "@/src/entities/product/services/update-product-service"
import { MAX_PRODUCT_IMAGES, productColors, productSizes } from "@/src/entities/product/domain"
import type { AdminCategory } from "@/src/entities/category/services/admin-category-service"
import type { AdminProduct } from "@/src/entities/product/services/admin-product-service"
import { Button, LinkButton } from "@/src/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"
import { Textarea } from "@/src/shared/ui/textarea"
import { cn } from "@/src/shared/lib/utils"

type ProductFormProps = {
  product?: AdminProduct
  categories: AdminCategory[]
}

type ProductImageField = {
  id: number
  fileName: string
}

function getSelectedFiles(form: HTMLFormElement, name: string) {
  return Array.from(form.elements).flatMap((element) =>
    element instanceof HTMLInputElement && element.type === "file" && element.name === name
      ? Array.from(element.files ?? [])
      : [],
  )
}

function replaceFormFiles(formData: FormData, name: string, files: File[]) {
  formData.delete(name)
  for (const file of files) formData.append(name, file, file.name)
}

function describeFiles(files: File[]) {
  return files.map((file, index) => ({
    index: index + 1,
    size: file.size,
    type: file.type || "не указан",
    hasName: Boolean(file.name),
  }))
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const nextImageId = useRef(1)
  const submittedMedia = useRef<{
    avatar: ReturnType<typeof describeFiles>
    images: ReturnType<typeof describeFiles>
  } | null>(null)
  const [color, setColor] = useState(product?.detail?.color ?? productColors[0].value)
  const [sizes, setSizes] = useState(
    () => new Set((product?.detail?.size ?? []).map((size) => String(size))),
  )
  const [retainedImages, setRetainedImages] = useState(() => new Set(product?.images ?? []))
  const [imageFields, setImageFields] = useState<ProductImageField[]>(() =>
    (product?.images.length ?? 0) < MAX_PRODUCT_IMAGES ? [{ id: 0, fileName: "" }] : [],
  )
  const [sizeSearch, setSizeSearch] = useState("")
  const [state, action, pending] = useActionState(
    product ? updateProductAction : createProductAction,
    {},
  )

  useEffect(() => {
    if (!state.success) return

    toast.success(state.message)
    router.push("/panel/products")
    router.refresh()
  }, [router, state.message, state.success])

  useEffect(() => {
    if (state.success || (!state.message && !state.errors)) return

    console.error("Ошибка сохранения товара", {
      message: state.message,
      errors: state.errors,
      media: submittedMedia.current,
    })
  }, [state])

  const ensureEmptyImageField = (fields: ProductImageField[], retainedCount: number) => {
    const selectedFields = fields.filter((field) => field.fileName)
    return retainedCount + selectedFields.length < MAX_PRODUCT_IMAGES
      ? [...selectedFields, { id: nextImageId.current++, fileName: "" }]
      : selectedFields
  }

  const selectedImageCount = imageFields.filter((field) => field.fileName).length
  const totalImageCount = retainedImages.size + selectedImageCount

  return (
    <form
      encType="multipart/form-data"
      aria-busy={pending}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (pending) return

        const form = event.currentTarget
        const avatarFiles = getSelectedFiles(form, "avatar")
        const imageFiles = getSelectedFiles(form, "images")
        const formData = new FormData(form)

        replaceFormFiles(formData, "avatar", avatarFiles)
        replaceFormFiles(formData, "images", imageFiles)
        submittedMedia.current = {
          avatar: describeFiles(avatarFiles),
          images: describeFiles(imageFiles),
        }
        startTransition(() => action(formData))
      }}
    >
      <Card>
        {product && <input type="hidden" name="id" value={product.id} />}
        <CardHeader className="border-b">
          <CardTitle>Данные товара</CardTitle>
          <CardDescription>
            {product
              ? "Измените данные товара и его характеристики, затем сохраните изменения."
              : "Заполните данные и характеристики. После создания товар появится в каталоге."}
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
                className="ui-focus h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive"
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
            <Field data-invalid={Boolean(state.errors?.price)}>
              <FieldLabel htmlFor="product-price">Цена</FieldLabel>
              <Input
                id="product-price"
                name="price"
                type="number"
                defaultValue={String(product?.price ?? 0)}
                min="0"
                max="999999999.99"
                step="0.01"
                disabled={pending}
                aria-invalid={Boolean(state.errors?.price)}
                required
              />
              <FieldError>{state.errors?.price?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.stock)}>
              <FieldLabel htmlFor="product-stock">Остаток</FieldLabel>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                defaultValue={String(product?.stock ?? 0)}
                min="0"
                max="2147483647"
                step="1"
                disabled={pending}
                aria-invalid={Boolean(state.errors?.stock)}
                required
              />
              <FieldError>{state.errors?.stock?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.avatar)}>
              <FieldLabel htmlFor="product-avatar">Главное изображение</FieldLabel>
              <Input
                id="product-avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={pending}
                aria-invalid={Boolean(state.errors?.avatar)}
                aria-required={!product}
              />
              <p className="text-sm text-muted-foreground">
                JPG, PNG или WebP, до 5 МБ. При создании товара главное изображение обязательно.
              </p>
              {product?.avatar && (
                // The configured Jino public URL is not known until runtime, so Next Image cannot be configured safely.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.avatar}
                  alt={`Текущее главное изображение ${product.name}`}
                  className="aspect-square w-24 rounded-md border border-border bg-muted object-contain p-2"
                />
              )}
              <FieldError>{state.errors?.avatar?.[0]}</FieldError>
            </Field>
            <Field className="sm:col-span-2" data-invalid={Boolean(state.errors?.images)}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <FieldTitle>Дополнительные изображения</FieldTitle>
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  {totalImageCount} из {MAX_PRODUCT_IMAGES}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Добавляйте изображения по одному. После выбора файла появится следующее поле. JPG,
                PNG или WebP, каждый файл до 5 МБ.
              </p>
              {product?.images.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {product.images.map((image, index) =>
                    retainedImages.has(image) ? (
                      <div
                        key={image}
                        className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-muted p-2"
                      >
                        <input type="hidden" name="retainedImage" value={image} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={`Дополнительное изображение ${index + 1} товара ${product.name}`}
                          className="aspect-square w-full rounded-md object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="xs"
                          isDisabled={pending}
                          onPress={() => {
                            const nextImages = new Set(retainedImages)
                            nextImages.delete(image)
                            setRetainedImages(nextImages)
                            setImageFields((fields) =>
                              ensureEmptyImageField(fields, nextImages.size),
                            )
                          }}
                        >
                          <Trash2Icon data-icon="inline-start" />
                          Удалить
                        </Button>
                      </div>
                    ) : null,
                  )}
                </div>
              ) : null}
              <div className="flex flex-col gap-3">
                {imageFields.map((field, index) => (
                  <Field key={field.id}>
                    <FieldLabel htmlFor={`product-image-${field.id}`}>
                      Новое изображение {retainedImages.size + index + 1}
                    </FieldLabel>
                    <div className="flex items-start gap-2">
                      <Input
                        id={`product-image-${field.id}`}
                        name="images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={pending}
                        aria-invalid={Boolean(state.errors?.images)}
                        onChange={(event) => {
                          const fileName = event.currentTarget.files?.[0]?.name ?? ""
                          setImageFields((fields) =>
                            ensureEmptyImageField(
                              fields.map((currentField) =>
                                currentField.id === field.id
                                  ? { ...currentField, fileName }
                                  : currentField,
                              ),
                              retainedImages.size,
                            ),
                          )
                        }}
                      />
                      {field.fileName ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          isDisabled={pending}
                          aria-label={`Удалить файл ${field.fileName}`}
                          onPress={() =>
                            setImageFields((fields) =>
                              ensureEmptyImageField(
                                fields.filter((currentField) => currentField.id !== field.id),
                                retainedImages.size,
                              ),
                            )
                          }
                        >
                          <Trash2Icon />
                        </Button>
                      ) : null}
                    </div>
                  </Field>
                ))}
              </div>
              {totalImageCount === MAX_PRODUCT_IMAGES ? (
                <p className="text-sm text-muted-foreground">Достигнут лимит изображений.</p>
              ) : null}
              <FieldError>{state.errors?.images?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.color)}>
              <FieldLabel>Цвет</FieldLabel>
              <input name="color" type="hidden" value={color} />
              <ColorSwatchPicker
                aria-label="Цвет"
                value={color}
                onChange={(selectedColor) => {
                  const nextColor = productColors.find(
                    (option) => option.value === selectedColor.toString("hex"),
                  )
                  if (nextColor) setColor(nextColor.value)
                }}
                className="flex flex-wrap gap-2"
              >
                {productColors.map((option) => (
                  <ColorSwatchPickerItem
                    key={option.value}
                    color={option.value}
                    aria-label={option.label}
                    isDisabled={pending}
                    className={({ isSelected }) =>
                      cn(
                        "ui-focus relative flex size-11 items-center justify-center rounded-md border border-input outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
                        isSelected &&
                          "border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background",
                      )
                    }
                  >
                    {({ isSelected }) => (
                      <>
                        <ColorSwatch color={option.value} className="size-7 rounded-sm" />
                        {isSelected && (
                          <CheckIcon
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none absolute size-4",
                              option.value === "#FFFFFF" || option.value === "#808080"
                                ? "text-foreground"
                                : "text-primary-foreground",
                            )}
                          />
                        )}
                      </>
                    )}
                  </ColorSwatchPickerItem>
                ))}
              </ColorSwatchPicker>
              <p className="text-sm text-muted-foreground">
                {productColors.find((option) => option.value === color)?.label}
              </p>
              <FieldError>{state.errors?.color?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.size)}>
              <FieldLabel htmlFor="product-size">Размеры</FieldLabel>
              {Array.from(sizes).map((size) => (
                <input key={size} name="size" type="hidden" value={size} />
              ))}
              <ComboBox
                aria-label="Размеры"
                inputValue={sizeSearch}
                onInputChange={setSizeSearch}
                onSelectionChange={(key) => {
                  if (key === null) return

                  const selectedSize = String(key)
                  setSizes((currentSizes) => {
                    const nextSizes = new Set(currentSizes)
                    if (nextSizes.has(selectedSize)) nextSizes.delete(selectedSize)
                    else nextSizes.add(selectedSize)
                    return nextSizes
                  })
                  setSizeSearch("")
                }}
                isDisabled={pending}
                className="relative"
              >
                <div className="relative">
                  <AriaInput
                    id="product-size"
                    placeholder="Найдите или выберите размеры"
                    className="ui-focus h-12 w-full rounded-md border border-input bg-background py-3 pr-12 pl-3 text-base/6 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50"
                  />
                  <AriaButton
                    type="button"
                    aria-label="Показать размеры"
                    className="ui-focus absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronDownIcon aria-hidden="true" className="size-5" />
                  </AriaButton>
                </div>
                <Popover className="z-50 mt-1 w-(--trigger-width) overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-sm">
                  <ListBox className="grid max-h-72 w-full grid-cols-3 gap-2 overflow-y-auto p-2 sm:grid-cols-4">
                    {productSizes.map((size) => (
                      <ListBoxItem
                        key={size}
                        id={String(size)}
                        textValue={String(size)}
                        className={() =>
                          cn(
                            "ui-focus flex min-h-12 w-full items-center justify-center rounded-md text-lg font-semibold tabular-nums outline-none transition-colors duration-150",
                            sizes.has(String(size))
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted data-focused:bg-muted",
                          )
                        }
                      >
                        {size}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </ComboBox>
              {sizes.size ? (
                <div
                  aria-label="Выбранные размеры"
                  className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4"
                >
                  {Array.from(sizes, Number)
                    .sort((a, b) => a - b)
                    .map((size) => (
                      <AriaButton
                        key={size}
                        type="button"
                        onPress={() =>
                          setSizes((currentSizes) => {
                            const nextSizes = new Set(currentSizes)
                            nextSizes.delete(String(size))
                            return nextSizes
                          })
                        }
                        className="ui-focus inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-md bg-secondary px-3 text-base font-semibold tabular-nums text-secondary-foreground outline-none hover:bg-border"
                      >
                        {size}
                        <XIcon aria-hidden="true" className="size-4" />
                        <span className="sr-only">Удалить размер {size}</span>
                      </AriaButton>
                    ))}
                </div>
              ) : (
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  Выберите хотя бы один размер
                </p>
              )}
              <FieldError>{state.errors?.size?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.country)}>
              <FieldLabel htmlFor="product-country">Страна</FieldLabel>
              <Input
                id="product-country"
                name="country"
                defaultValue={product?.detail?.country ?? ""}
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
          <FieldError className="mt-6">{!state.success && state.message}</FieldError>
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
