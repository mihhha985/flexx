#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6043906d057d62a0512f4ff92c2f73463d3404f3a613f8fee286fa86ee4100e2/contract';
import startContract from '../../snapshots/6043906d057d62a0512f4ff92c2f73463d3404f3a613f8fee286fa86ee4100e2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e50f96053bcbca3fa511e37cc374157268dda8801d0dd4db0645b5014f803112/contract';
import endContract from '../../snapshots/e50f96053bcbca3fa511e37cc374157268dda8801d0dd4db0645b5014f803112/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'product', column: 'imageUrl' }),
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
      this.addColumn({
        schema: 'public',
        table: 'orderItem',
        column: col('size', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'product',
        column: col('avatar', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-product-avatar', {
        check: () => placeholder('backfill-product-avatar:check'),
        run: () => placeholder('backfill-product-avatar:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'product', column: 'avatar' }),
      this.addColumn({
        schema: 'public',
        table: 'product',
        column: col('images', 'text[]', { codecRef: { codecId: 'pg/text@1', many: true } }),
      }),
      this.dataTransform(endContract, 'backfill-product-images', {
        check: () => placeholder('backfill-product-images:check'),
        run: () => placeholder('backfill-product-images:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'product', column: 'images' }),
      this.alterColumnType({
        schema: 'public',
        table: 'product_detail',
        column: 'size',
        options: {
          qualifiedTargetType: 'int4[]',
          formatTypeExpected: 'integer',
          rawTargetTypeForLabel: 'int4[]',
        },
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'product',
        constraint: 'product_images_elem_not_null_2f12556f',
        expression: 'array_position("images", NULL) IS NULL',
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
