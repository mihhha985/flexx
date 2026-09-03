export type Category = {
  id: number
  name: string
  slug: string
  order: number
}

export type Product = {
  id: number
  name: string
  slug: string
  price: number
  description: string
  imageUrl: string | null
  isActive: boolean
  stock: number
  categoryId: number
  category: Category
}

export const categories: Category[] = [
  { id: 1, name: "Электроника", slug: "electron", order: 10 },
  { id: 2, name: "Одежда", slug: "clothing", order: 20 },
  { id: 3, name: "Для дома", slug: "home", order: 30 },
  { id: 4, name: "Красота", slug: "beauty", order: 40 },
  { id: 5, name: "Спорт", slug: "sports", order: 50 },
]

const productSeeds = [
  [1, "Беспроводные наушники", "wireless-headphones", 6990, "Компактные наушники с активным шумоподавлением и зарядным кейсом.", 12, 1],
  [2, "Портативная колонка", "portable-speaker", 4590, "Защищённая от брызг колонка с автономностью до 14 часов.", 8, 1],
  [3, "Базовая футболка", "basic-t-shirt", 1990, "Мягкая хлопковая футболка свободного кроя на каждый день.", 24, 2],
  [4, "Городской рюкзак", "city-backpack", 5490, "Лаконичный рюкзак с отделением для ноутбука и скрытым карманом.", 6, 2],
  [5, "Настольная лампа", "desk-lamp", 3290, "Регулируемый тёплый свет и сенсорное управление яркостью.", 15, 3],
  [6, "Набор полотенец", "towel-set", 2490, "Три плотных хлопковых полотенца нейтральных оттенков.", 19, 3],
  [7, "Увлажняющий крем", "moisturizing-cream", 1890, "Лёгкий ежедневный крем без отдушек для всех типов кожи.", 31, 4],
  [8, "Коврик для йоги", "yoga-mat", 2790, "Нескользящий коврик толщиной 6 мм с ремнём для переноски.", 10, 5],
] as const

export const products: Product[] = productSeeds.map(
  ([id, name, slug, price, description, stock, categoryId]) => ({
    id,
    name,
    slug,
    price,
    description,
    imageUrl: null,
    isActive: true,
    stock,
    categoryId,
    category: categories.find((category) => category.id === categoryId)!,
  }),
)

export const featuredProducts = products.slice(0, 4)

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price)
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}
