import assert from "node:assert/strict"
import test from "node:test"
import {
  parseColor,
  parsePrice,
  parseSourceUrl,
  productSlug,
  PRODUCT_URL,
} from "./import-amazing-red.ts"

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
  assert.throws(
    () => parseColor("https://amazingred.ru/d/krossovki-unknown-123/"),
    /Неизвестный цвет/,
  )
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
