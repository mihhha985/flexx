import { randomInt, randomUUID } from "node:crypto"
import { pathToFileURL } from "node:url"
import { orderSchema } from "../src/entities/order/domain.ts"
import { orderStatuses, type OrderStatus } from "../src/entities/order/status.ts"

const orderCount = 94
const dayMs = 24 * 60 * 60 * 1000
const customers = [
  ["Александр", "Соколов", "alexander", "sokolov"],
  ["Анна", "Смирнова", "anna", "smirnova"],
  ["Дмитрий", "Кузнецов", "dmitry", "kuznetsov"],
  ["Мария", "Попова", "maria", "popova"],
  ["Максим", "Новиков", "maxim", "novikov"],
  ["Елена", "Морозова", "elena", "morozova"],
  ["Артём", "Волков", "artem", "volkov"],
  ["Ольга", "Лебедева", "olga", "lebedeva"],
  ["Илья", "Орлов", "ilya", "orlov"],
  ["Дарья", "Павлова", "daria", "pavlova"],
] as const
const emailDomains = ["mail.ru", "yandex.ru", "gmail.com", "bk.ru", "inbox.ru", "list.ru"]
const phonePrefixes = ["903", "905", "906", "915", "916", "925", "926", "950", "977", "999"]
const cities = ["Москва", "Санкт-Петербург", "Казань", "Самара", "Тула", "Пермь"]
const streets = ["Тестовая", "Демонстрационная", "Примерная", "Учебная"]
const comments = [
  "Позвоните перед доставкой.",
  "Доставка после 18:00.",
  "Пожалуйста, проверьте упаковку.",
  "Оставить на пункте выдачи.",
  "Связаться по электронной почте.",
  undefined,
]

type CatalogVariant = {
  id: number
  price: number
  colorName: string
  colorSlug: string
  product: { id: number; name: string; isActive: boolean }
  sizes: readonly { size: number }[]
}

export function generateFakeOrders(variants: readonly CatalogVariant[], now = new Date()) {
  const choices = variants
    .filter((variant) => variant.product.isActive)
    .flatMap((variant) => variant.sizes.map(({ size }) => ({ variant, size })))
  if (!choices.length) {
    throw new Error("Нет активных товаров с размерами. Сначала добавьте товары в каталог.")
  }

  const statuses = Object.keys(orderStatuses) as OrderStatus[]
  const phoneBase = randomInt(1000000, 10000000 - orderCount)

  return Array.from({ length: orderCount }, (_, index) => {
    const number = index + 1
    const [firstName, , firstNameLatin] = customers[index % customers.length]
    const [, lastName, , lastNameLatin] =
      customers[Math.floor(index / customers.length) % customers.length]
    const birthYear = randomInt(1980, 2005)
    const emailNames = [
      `${firstNameLatin}.${lastNameLatin}`,
      `${lastNameLatin}_${firstNameLatin}${birthYear}`,
      `${firstNameLatin}${birthYear}.${lastNameLatin}`,
    ]
    const phoneDigits = String(phoneBase + index)
    const available = [...choices]
    const items = Array.from({ length: randomInt(1, Math.min(4, choices.length) + 1) }, () => {
      const [{ variant, size }] = available.splice(randomInt(available.length), 1)
      const priceCents = Math.round(variant.price * 100)
      if (priceCents < 0 || !Number.isSafeInteger(priceCents)) {
        throw new Error("Некорректная цена товара в каталоге.")
      }
      return {
        productId: variant.product.id,
        variantId: variant.id,
        productName: variant.product.name,
        colorName: variant.colorName,
        colorSlug: variant.colorSlug,
        size,
        unitPrice: priceCents / 100,
        quantity: randomInt(1, 4),
      }
    })
    const customer = {
      customerName: `${firstName} ${lastName}`,
      customerEmail: `${emailNames[index % emailNames.length]}@${emailDomains[index % emailDomains.length]}`,
      customerPhone: `+7 (${phonePrefixes[index % phonePrefixes.length]}) ${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 5)}-${phoneDigits.slice(5)}`,
      shippingAddress: `г. ${cities[index % cities.length]}, ул. ${streets[index % streets.length]}, д. ${number}, кв. ${randomInt(1, 201)}`,
      comment: comments[index % comments.length],
    }
    orderSchema.parse({ ...customer, items })
    const totalCents = items.reduce(
      (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
      0,
    )
    if (!Number.isSafeInteger(totalCents)) {
      throw new Error("Сумма тестового заказа слишком велика.")
    }
    const createdAtMs = now.getTime() - randomInt(1, 61) * dayMs - randomInt(dayMs)
    return {
      ...customer,
      publicId: randomUUID(),
      status: statuses[index % statuses.length],
      total: totalCents / 100,
      createdAt: new Date(createdAtMs).toISOString(),
      updatedAt: new Date(createdAtMs + randomInt(dayMs)).toISOString(),
      items,
    }
  })
}

async function main() {
  const args = process.argv.slice(2)
  if (args.some((arg) => arg !== "--dry-run")) {
    throw new Error("Допустимый параметр: --dry-run (просмотр без записи).")
  }
  const { connectDatabase, db } = await import("../src/prisma/db.ts")
  try {
    await connectDatabase()
    const result = await db.transaction(async (tx) => {
      const variants = await tx.orm.public.ProductVariant.where({ isActive: true })
        .select("id", "price", "colorName", "colorSlug")
        .include("product", (product) => product.select("id", "name", "isActive"))
        .include("sizes", (sizes) => sizes.select("size"))
        .all()
      const orders = generateFakeOrders(variants)
      if (args.includes("--dry-run")) return { orders, created: 0, deleted: 0 }

      // OrderItem rows are removed by ON DELETE CASCADE. The primary key is never null.
      const deleted = await tx.orm.public.Order.where((order) =>
        order.id.isNotNull(),
      ).deleteAndCount()
      const afterDeletion = await tx.orm.public.Order.aggregate((aggregate) => ({
        count: aggregate.count(),
      }))
      if (afterDeletion.count !== 0) {
        throw new Error("Не удалось удалить все прежние заявки. Изменения отменены.")
      }
      // Synthetic historical orders do not reserve or change catalog stock.
      // Deletion and all 94 new orders commit together, or all roll back.
      for (const { items, ...data } of orders) {
        const order = await tx.orm.public.Order.select("id").create(data)
        await tx.orm.public.OrderItem.createAll(
          items.map((item) => ({ ...item, orderId: order.id })),
        )
      }
      const afterCreation = await tx.orm.public.Order.aggregate((aggregate) => ({
        count: aggregate.count(),
      }))
      if (afterCreation.count !== orderCount) {
        throw new Error("Количество заявок после создания отличается от 94. Изменения отменены.")
      }
      return { orders, created: orders.length, deleted }
    })
    if (args.includes("--dry-run")) console.log(JSON.stringify(result.orders, null, 2))
    console.log(
      `Удалено заявок: ${result.deleted}. Создано заявок: ${result.created}. Остатки товаров не изменены.`,
    )
    for (const [status, label] of Object.entries(orderStatuses)) {
      console.log(`${label}: ${result.orders.filter((order) => order.status === status).length}`)
    }
  } finally {
    await db.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Не удалось создать тестовые заявки.")
    process.exitCode = 1
  })
}
