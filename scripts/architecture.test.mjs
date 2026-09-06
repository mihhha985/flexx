import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import test from "node:test"
import ts from "typescript"

const files = readdirSync("src", { recursive: true }).filter(
  (file) => /\.(ts|tsx)$/.test(file) && !file.endsWith(".d.ts") && !file.endsWith(".test.ts"),
)

test("UI enters services; database access stays in repositories and Prisma infrastructure", () => {
  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      readFileSync(`src/${file}`, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    )
    const imports = source.statements
      .filter(ts.isImportDeclaration)
      .filter((node) => !node.importClause?.isTypeOnly)
      .map((node) => node.moduleSpecifier.text)
    assert.ok(!file.includes("/actions/"), file)
    if (!file.startsWith("prisma/") && !file.includes("/repository/")) {
      assert.ok(
        !imports.some((value) => value.includes("prisma/db")),
        `${file} accesses DB outside repository`,
      )
    }
    if (file.includes("/repository/")) {
      assert.ok(
        !imports.some((value) => value.includes("/services/")),
        `${file} depends on services`,
      )
      assert.ok(
        !/requireAdmin|console\.|safeParse|"use server"/.test(source.text),
        `${file} contains service responsibilities`,
      )
    }
    if (file.endsWith(".tsx")) {
      assert.ok(
        !imports.some((value) => value.includes("/repository/")),
        `${file} bypasses services`,
      )
    }
  }
})
