import { parseArgs } from "node:util"
import { pathToFileURL } from "node:url"
import { setTimeout } from "node:timers/promises"
import puppeteer, { type Page } from "puppeteer"
import { z } from "zod"
import { MAX_PRODUCT_IMAGES } from "../src/entities/product/domain.ts"
import type { UploadedProductImage } from "../src/entities/product/services/product-image-storage.ts"

export const PRODUCT_URL = "https://amazingred.ru/d/krossovki-puma-fade-nitro-ls-black-40620305/"

const colorHexes: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  grey: "#808080",
  beige: "#F5F5DC",
  brown: "#A52A2A",
}

const sourceUrlSchema = z.url().refine((value) => {
  if (!URL.canParse(value)) return false
  const url = new URL(value)
  return url.origin === "https://amazingred.ru" && /^\/d\/[^/]+\/$/.test(url.pathname)
}, "Ожидалась ссылка на карточку Amazing Red")

export function parseSourceUrl(value: string): string {
  const trimmed = value.trim()
  const url = trimmed.match(/^\[[^\]]*\]\((https:\/\/[^\s)]+)\)$/)?.[1] ?? trimmed
  const parsed = sourceUrlSchema.safeParse(url)
  if (!parsed.success) {
    throw new Error("Укажите ссылку вида https://amazingred.ru/d/название-товара/ в --url")
  }
  return parsed.data
}

export function parseColor(url: string) {
  const pathname = new URL(parseSourceUrl(url)).pathname
  const colorSlug = pathname
    .match(/-(black|white|grey|beige|brown)-[a-z0-9]+\/$/i)?.[1]
    ?.toLowerCase()
  if (!colorSlug)
    throw new Error(`Неизвестный цвет в ссылке: ${url}. Добавьте цвет в скрипт импорта.`)
  return { colorSlug, colorHex: colorHexes[colorSlug] }
}

const imageSchema = z.url().refine((value) => new URL(value).protocol === "https:")
const textSchema = z.string().trim().min(1)
const sourceSchema = z.object({
  name: textSchema.max(200),
  description: textSchema.max(10000),
  links: z
    .array(z.object({ url: sourceUrlSchema }))
    .min(1)
    .max(3),
})

export function productSlug(url: string): string {
  const pathname = new URL(parseSourceUrl(url)).pathname
  return pathname.slice("/d/".length, -1).slice(0, 20).replace(/-+$/, "")
}

export function parsePrice(text: string): number {
  const amount = text
    .replace(/\s/g, "")
    .replace(/руб\.?$|₽$/i, "")
    .replace(",", ".")
  if (!/^\d+(?:\.\d{1,2})?$/.test(amount)) {
    throw new Error(`Не удалось распознать цену: ${text}`)
  }
  return z.number().finite().positive().max(999999999.99).parse(Number(amount))
}

async function fetchImage(url: string, method: "GET" | "HEAD" = "GET") {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, {
        method,
        signal: AbortSignal.timeout(30_000),
        redirect: "error",
      })
      if (!response.ok) {
        await response.body?.cancel()
        throw new Error(`HTTP ${response.status}`)
      }
      // Read the body inside the retry block so interrupted downloads can retry too.
      return await response.blob()
    } catch (error) {
      if (attempt === 2) {
        throw new Error(`Не удалось получить фото: ${url}`, { cause: error })
      }
      await setTimeout(1000 * (attempt + 1))
    }
  }
}

export async function readProductPage(page: Page) {
  await page.waitForSelector("h1.product-specs__title")
  await page.waitForSelector(".tab__description")
  await page.waitForSelector(".product-specs__color")
  return sourceSchema.parse(
    await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(".product-specs__colors a.all-colors__item"),
      )
        .slice(0, 3)
        .map((link) => ({ url: link.href }))
      return {
        name: document.querySelector("h1.product-specs__title")?.textContent?.trim(),
        description: document.querySelector(".tab__description")?.textContent?.trim(),
        links: links.length ? links : [{ url: location.href }],
      }
    }),
  )
}

async function visit(page: Page, url: string) {
  sourceUrlSchema.parse(url)
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 })
  if (!response?.ok()) throw new Error(`Страница недоступна: ${url} (${response?.status()})`)
  if (new URL(page.url()).pathname !== new URL(url).pathname) {
    throw new Error(`Вместо карточки открылась другая страница: ${page.url()}`)
  }
}

export async function scrapeProduct(url: string = PRODUCT_URL) {
  url = parseSourceUrl(url)
  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(30_000)
    await visit(page, url)
    const { name, description, links } = await readProductPage(page)
    const variants = []
    for (const [order, link] of links.entries()) {
      if (page.url() !== link.url) await visit(page, link.url)
      await page.waitForSelector(".product-specs__color")
      await page.waitForSelector(".product-specs__inner-price .price__amount")
      await page.waitForSelector(".mobile-swiper__slide:not(.swiper-slide-duplicate) img")
      const details = await page.evaluate(() => ({
        colorName: document.querySelector(".product-specs__color")?.textContent?.trim(),
        // A discounted price takes precedence over the crossed-out original price.
        price: (
          document.querySelector(".product-specs__inner-price .price__amount--discount") ??
          document.querySelector(".product-specs__inner-price .price__amount--default")
        )?.textContent?.trim(),
        images: Array.from(
          document.querySelectorAll<HTMLImageElement>(
            ".mobile-swiper__slide:not(.swiper-slide-duplicate) img.mobile-swiper__image",
          ),
        ).map((image) => image.src),
      }))
      const color = parseColor(link.url)
      const images = z
        .array(imageSchema)
        .min(1)
        .max(MAX_PRODUCT_IMAGES)
        .parse([...new Set(details.images)].slice(0, MAX_PRODUCT_IMAGES))
      variants.push({
        colorName: textSchema.parse(details.colorName?.replace(/^Цвет:\s*/i, "")),
        ...color,
        price: parsePrice(textSchema.parse(details.price)),
        avatar: images[0],
        images,
        isActive: true,
        order,
      })
    }
    if (new Set(variants.map((variant) => variant.colorSlug)).size !== variants.length) {
      throw new Error("Выбранные варианты должны иметь разные цвета")
    }
    return { name, description, country: "германия", slug: productSlug(url), variants }
  } finally {
    await browser.close()
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      category: { type: "string", default: "puma" },
      url: { type: "string", default: PRODUCT_URL },
      help: { type: "boolean", default: false },
    },
  })
  if (values.help) {
    console.log("npm run import:amazing-red -- [--url <ссылка>] [--dry-run] [--category puma]")
    return
  }
  const data = await scrapeProduct(values.url)
  if (values["dry-run"]) {
    console.log(JSON.stringify({ ...data, categorySlug: values.category }, null, 2))
    return
  }

  // Load the shared Prisma client only for a real import; preview needs no database.
  const { db, connectDatabase } = await import("../src/prisma/db.ts")
  const { uploadProductImage, getProductImageFile, deleteUploadedProductImages } =
    await import("../src/entities/product/services/product-image-storage.ts")
  const uploads: UploadedProductImage[] = []
  let committed = false
  try {
    await connectDatabase()
    const category = await db.orm.public.Category.where({ slug: values.category })
      .select("id")
      .first()
    if (!category)
      throw new Error(`Категория «${values.category}» не найдена. Создайте её в панели.`)
    const existing = await db.orm.public.Product.where({ slug: data.slug }).select("id").first()
    if (existing) {
      throw new Error(
        `Товар со slug «${data.slug}» уже существует (ID ${existing.id}). Запись отменена.`,
      )
    }
    // Upload outside the database transaction. Remove only this run's objects on failure.
    const uploadedBySource = new Map<string, string>()
    for (const variant of data.variants) {
      const images: string[] = []
      for (const source of variant.images) {
        let storedUrl = uploadedBySource.get(source)
        if (!storedUrl) {
          const sourceUrl = new URL(source)
          if (
            sourceUrl.origin !== "https://amazingred.ru" ||
            !sourceUrl.pathname.startsWith("/upload/")
          ) {
            throw new Error(`Неожиданный адрес фотографии: ${source}`)
          }
          const blob = await fetchImage(source)
          const file = new File([blob], sourceUrl.pathname.split("/").at(-1) ?? "image", {
            type: blob.type.split(";")[0],
          })
          const validated = getProductImageFile(file)
          if (validated.error || !validated.file)
            throw new Error(validated.error ?? "Пустое изображение")
          const upload = await uploadProductImage(validated.file)
          uploads.push(upload)
          await fetchImage(upload.url, "HEAD")
          storedUrl = upload.url
          uploadedBySource.set(source, storedUrl)
        }
        images.push(storedUrl)
      }
      variant.avatar = images[0]
      variant.images = images
      console.log(`Фото «${variant.colorName}»: загружено ${images.length}`)
    }
    const result = await db.transaction(async (tx) => {
      const duplicate = await tx.orm.public.Product.where({ slug: data.slug }).select("id").first()
      if (duplicate)
        throw new Error(`Товар со slug «${data.slug}» уже существует. Запись отменена.`)
      const { variants, ...product } = data
      const created = await tx.orm.public.Product.create({
        ...product,
        categoryId: category.id,
        isActive: true,
      })
      for (const variant of variants) {
        await tx.orm.public.ProductVariant.create({ ...variant, productId: created.id })
      }
      return created
    })
    committed = true
    console.log(
      `Создан товар «${result.name}» (ID ${result.id}), вариантов цвета: ${data.variants.length}, фото в S3: ${uploads.length}.`,
    )
  } catch (error) {
    if (!committed && uploads.length) {
      try {
        await deleteUploadedProductImages(uploads)
      } catch {
        console.error(
          "Не удалось очистить загруженные файлы после ошибки. Ключи:",
          uploads.map((image) => image.key),
        )
      }
    }
    throw error
  } finally {
    await db.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Не удалось импортировать товар")
    process.exitCode = 1
  })
}
