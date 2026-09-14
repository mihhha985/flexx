import "server-only"

import { randomUUID } from "node:crypto"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { z } from "zod"

const maxProductImageBytes = 5 * 1024 * 1024

const imageExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const

const storageConfigSchema = z.object({
  endpoint: z.string().trim().url(),
  region: z.string().trim().min(1),
  bucket: z.string().trim().min(1),
  prefix: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/, "Укажите путь из букв, цифр, дефисов и подчёркиваний"),
  accessKeyId: z.string().trim().min(1),
  secretAccessKey: z.string().trim().min(1),
  publicBaseUrl: z.string().trim().url(),
})

export class ProductImageStorageError extends Error {
  constructor(message = "Не удалось загрузить изображение. Попробуйте ещё раз позже.") {
    super(message)
  }
}

export type UploadedProductImage = {
  key: string
  url: string
}

function getStorageConfig() {
  const result = storageConfigSchema.safeParse({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    prefix: process.env.S3_PREFIX,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL,
  })

  if (!result.success) {
    console.error(
      "Некорректная конфигурация S3 для изображений товаров",
      result.error.issues.map((issue) => ({
        variable:
          {
            endpoint: "S3_ENDPOINT",
            region: "S3_REGION",
            bucket: "S3_BUCKET",
            prefix: "S3_PREFIX",
            accessKeyId: "S3_ACCESS_KEY_ID",
            secretAccessKey: "S3_SECRET_ACCESS_KEY",
            publicBaseUrl: "S3_PUBLIC_BASE_URL",
          }[issue.path[0] as string] ?? issue.path.join("."),
        message: issue.message,
      })),
    )
    throw new ProductImageStorageError("Не удалось загрузить изображение. Проверьте настройки S3.")
  }

  return {
    ...result.data,
    publicBaseUrl: result.data.publicBaseUrl.replace(/\/+$/, ""),
  }
}

function createS3Client(config: ReturnType<typeof getStorageConfig>) {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  })
}

function getProductImageKey(imageUrl: string, publicBaseUrl: string, prefix: string) {
  const baseUrl = new URL(`${publicBaseUrl}/`)
  const url = new URL(imageUrl)

  if (url.origin !== baseUrl.origin || !url.pathname.startsWith(baseUrl.pathname)) return null

  const key = decodeURIComponent(url.pathname.slice(baseUrl.pathname.length))
  return key.startsWith(`${prefix}/products/`) ? key : null
}

export function getProductImageFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) return { file: null }

  if (value.size === 0) {
    return value.name
      ? { file: null, error: "Файл изображения не должен быть пустым." }
      : { file: null }
  }
  if (value.size > maxProductImageBytes) {
    return { file: null, error: "Размер изображения не должен превышать 5 МБ." }
  }
  if (!(value.type in imageExtensions)) {
    return { file: null, error: "Выберите изображение в формате JPG, PNG или WebP." }
  }

  return { file: value }
}

export async function uploadProductImage(file: File): Promise<UploadedProductImage> {
  const extension = imageExtensions[file.type as keyof typeof imageExtensions]
  if (!extension)
    throw new ProductImageStorageError("Выберите изображение в формате JPG, PNG или WebP.")

  const config = getStorageConfig()
  const key = `${config.prefix}/products/${randomUUID()}.${extension}`

  try {
    await createS3Client(config).send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    )
  } catch (error) {
    console.error("Не удалось загрузить изображение товара в S3", error)
    throw new ProductImageStorageError()
  }

  return { key, url: new URL(key, `${config.publicBaseUrl}/`).toString() }
}

export async function deleteProductImageByKey(key: string) {
  const config = getStorageConfig()
  await createS3Client(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
}

export async function deleteProductImage(imageUrl: string | null) {
  if (!imageUrl) return

  const config = getStorageConfig()
  const key = getProductImageKey(imageUrl, config.publicBaseUrl, config.prefix)
  if (!key) return

  await createS3Client(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
}
