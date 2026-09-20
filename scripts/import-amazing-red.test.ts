import assert from "node:assert/strict"
import test from "node:test"
import {
  parseColor,
  selectVariantUrls,
  parseVariantColors,
  parsePrice,
  parseSourceUrl,
  productSlug,
  PRODUCT_URL,
} from "./import-amazing-red.ts"

test("случайный выбор использует весь список и не меняет исходный массив", () => {
  const urls = Array.from(
    { length: 6 },
    (_, index) => `https://amazingred.ru/d/model-black-${index}/`,
  )
  const original = [...urls]
  assert.deepEqual(
    selectVariantUrls(urls, () => 0.999),
    urls.slice(0, 3),
  )
  const sample = selectVariantUrls(urls, () => 0.5)
  assert.equal(sample.length, 3)
  assert.equal(new Set(sample).size, 3)
  assert.ok(sample.some((url) => urls.indexOf(url) >= 3))
  assert.deepEqual(urls, original)
})

test("одинаковые артикулы исключаются до выбора, даже при разных ссылках и регистре", () => {
  const first = "https://amazingred.ru/d/model-black-AB123/"
  const second = "https://amazingred.ru/d/model-white-cd456/"
  const urls = [first, first, "https://amazingred.ru/d/other-black-ab123/", second]
  assert.deepEqual(new Set(selectVariantUrls(urls)), new Set([first, second]))
})

test("если вариантов меньше трёх, сохраняется весь доступный набор", () => {
  assert.deepEqual(selectVariantUrls([]), [])
  assert.deepEqual(selectVariantUrls([PRODUCT_URL]), [PRODUCT_URL])
  const urls = [PRODUCT_URL, "https://amazingred.ru/d/model-white-123/"]
  assert.deepEqual(new Set(selectVariantUrls(urls)), new Set(urls))
  assert.throws(() => selectVariantUrls(["https://amazingred.ru/d/model/"]), /артикул/)
})

test("одинаковый цвет с разными артикулами сохраняется отдельными вариантами", () => {
  const urls = [
    "https://amazingred.ru/d/krossovki-puma-rs-x-efekt-prm-black-39077601/",
    "https://amazingred.ru/d/krossovki-puma-rs-x-efekt-prm-white-39077602/",
    "https://amazingred.ru/d/krossovki-puma-rs-x-efekt-prm-black-39077621/",
  ]
  assert.deepEqual(parseVariantColors(urls), [
    { colorSlug: "black-39077601", colorHex: "#000000" },
    { colorSlug: "white", colorHex: "#FFFFFF" },
    { colorSlug: "black-39077621", colorHex: "#000000" },
  ])
  assert.deepEqual(parseVariantColors([...urls].reverse()), parseVariantColors(urls).reverse())
  assert.deepEqual(parseVariantColors([PRODUCT_URL]), [parseColor(PRODUCT_URL)])
})

test("повторяющийся неизвестный цвет сохраняет белый HEX и буквенный артикул", () => {
  assert.deepEqual(
    parseVariantColors([
      "https://amazingred.ru/d/model-blue-ab123/",
      "https://amazingred.ru/d/model-blue-ab456/",
    ]),
    [
      { colorSlug: "blue-ab123", colorHex: "#FFFFFF" },
      { colorSlug: "blue-ab456", colorHex: "#FFFFFF" },
    ],
  )
})

test("принимает обычную и Markdown-ссылку, отклоняет посторонний адрес", () => {
  assert.equal(parseSourceUrl(` ${PRODUCT_URL} `), PRODUCT_URL)
  assert.equal(parseSourceUrl(`[Карточка](${PRODUCT_URL})`), PRODUCT_URL)
  assert.throws(() => parseSourceUrl("https://example.com/d/product/"), /Укажите ссылку/)
  assert.throws(() => parseSourceUrl("не ссылка"), /Укажите ссылку/)
})

test("распознаёт цвета New Balance с буквенно-цифровыми артикулами и сохраняет Puma", () => {
  assert.deepEqual(
    parseColor("https://amazingred.ru/d/krossovki-new-balance-204l-beige-u204l2sz/"),
    {
      colorSlug: "beige",
      colorHex: "#F5F5DC",
    },
  )
  assert.deepEqual(
    parseColor("https://amazingred.ru/d/krossovki-new-balance-204l-brown-u204l273/"),
    {
      colorSlug: "brown",
      colorHex: "#A52A2A",
    },
  )
  assert.deepEqual(parseColor(PRODUCT_URL), { colorSlug: "black", colorHex: "#000000" })
})

test("неизвестный цвет получает белый HEX и отдельный slug", () => {
  assert.deepEqual(parseColor("https://amazingred.ru/d/krossovki-puma-homura-og-red-40912506/"), {
    colorSlug: "red",
    colorHex: "#FFFFFF",
  })
  assert.deepEqual(parseColor("https://amazingred.ru/d/model-green-123/"), {
    colorSlug: "green",
    colorHex: "#FFFFFF",
  })
  assert.deepEqual(parseColor("https://amazingred.ru/d/model/"), {
    colorSlug: "white",
    colorHex: "#FFFFFF",
  })
})

test("цена сохраняет копейки и поддерживает пробелы-разделители", () => {
  assert.equal(parsePrice("16\u00a0999 руб."), 16999)
  assert.equal(parsePrice("15 990,50 ₽"), 15990.5)
})

test("пустая, отрицательная или неоднозначная цена не превращается в цену товара", () => {
  for (const value of ["", "от 1000 руб.", "-100", "16999 15999 руб.", "0", "NaN"]) {
    assert.throws(() => parsePrice(value), value)
  }
})

test("slug берётся из имени страницы и остаётся совместимым с каталогом", () => {
  assert.equal(productSlug(PRODUCT_URL), "krossovki-puma-fade")
  assert.throws(() => productSlug("https://example.com/d/product/"))
})
