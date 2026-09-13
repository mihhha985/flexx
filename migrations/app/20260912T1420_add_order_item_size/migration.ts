#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6890118a91a5388b640b571712efc615f2106fe9536388528b9c98ca98d3afd3/contract';
import startContract from '../../snapshots/6890118a91a5388b640b571712efc615f2106fe9536388528b9c98ca98d3afd3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/871a0000a4525508b60c3fa4e6090440d118be887853d0a034f3203c12ba7514/contract';
import endContract from '../../snapshots/871a0000a4525508b60c3fa4e6090440d118be887853d0a034f3203c12ba7514/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'orderItem',
        column: col('size', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
