#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6043906d057d62a0512f4ff92c2f73463d3404f3a613f8fee286fa86ee4100e2/contract';
import startContract from '../../snapshots/6043906d057d62a0512f4ff92c2f73463d3404f3a613f8fee286fa86ee4100e2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/6890118a91a5388b640b571712efc615f2106fe9536388528b9c98ca98d3afd3/contract';
import endContract from '../../snapshots/6890118a91a5388b640b571712efc615f2106fe9536388528b9c98ca98d3afd3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, rawSql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'product_detail',
        constraint: 'product_detail_color_key',
      }),
      this.dropConstraint({
        schema: 'public',
        table: 'product_detail',
        constraint: 'product_detail_country_key',
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'product_detail',
        column: 'size',
        options: {
          qualifiedTargetType: 'int4[]',
          formatTypeExpected: 'integer[]',
          rawTargetTypeForLabel: 'int4[]',
          using: 'ARRAY["size"]',
        },
      }),
      rawSql({
        id: 'dataTransform.product_detail.normalize_color',
        label: 'Normalize product detail colors for the Color enum',
        operationClass: 'data',
        target: {
          id: 'postgres',
          details: {
            schema: 'public',
            objectType: 'column',
            name: 'color',
            table: 'product_detail',
          },
        },
        precheck: [
          {
            description: 'ensure every product detail color can be converted to the Color enum',
            sql: `SELECT NOT EXISTS (
              SELECT 1
              FROM "public"."product_detail"
              WHERE lower(trim("color")) NOT IN (
                'белый', 'чёрный', 'черный', 'красный', 'синий', 'зелёный', 'зеленый', 'серый',
                '#ffffff', '#000000', '#ff0000', '#0000ff', '#008000', '#808080'
              )
            ) AS "result"`,
          },
        ],
        execute: [
          {
            description: 'convert product detail colors to Color enum values',
            sql: `UPDATE "public"."product_detail"
              SET "color" = CASE lower(trim("color"))
                WHEN 'белый' THEN '#FFFFFF'
                WHEN 'чёрный' THEN '#000000'
                WHEN 'черный' THEN '#000000'
                WHEN 'красный' THEN '#FF0000'
                WHEN 'синий' THEN '#0000FF'
                WHEN 'зелёный' THEN '#008000'
                WHEN 'зеленый' THEN '#008000'
                WHEN 'серый' THEN '#808080'
                WHEN '#ffffff' THEN '#FFFFFF'
                WHEN '#000000' THEN '#000000'
                WHEN '#ff0000' THEN '#FF0000'
                WHEN '#0000ff' THEN '#0000FF'
                WHEN '#008000' THEN '#008000'
                WHEN '#808080' THEN '#808080'
              END`,
          },
        ],
        postcheck: [
          {
            description: 'verify every product detail color is a Color enum value',
            sql: `SELECT NOT EXISTS (
              SELECT 1
              FROM "public"."product_detail"
              WHERE "color" NOT IN ('#FFFFFF', '#000000', '#FF0000', '#0000FF', '#008000', '#808080')
            ) AS "result"`,
          },
        ],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'product_detail',
        constraint: 'product_detail_color_check_4fe16565',
        expression:
          "\"color\" IN ('#FFFFFF', '#000000', '#FF0000', '#0000FF', '#008000', '#808080')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'product_detail',
        constraint: 'product_detail_size_elem_not_null_a8715850',
        expression: 'array_position("size", NULL) IS NULL',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
