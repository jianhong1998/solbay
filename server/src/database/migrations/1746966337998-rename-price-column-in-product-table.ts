import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePriceColumnInProductTable1746966337998
  implements MigrationInterface
{
  name = 'RenamePriceColumnInProductTable1746966337998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order"
                RENAME COLUMN "total_amount_in_lamport" TO "total_amount_in_micro_usdc"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order"
                RENAME COLUMN "total_amount_in_micro_usdc" TO "total_amount_in_lamport"
        `);
  }
}
