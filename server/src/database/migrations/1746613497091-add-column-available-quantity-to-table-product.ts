import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnAvailableQuantityToTableProduct1746613497091
  implements MigrationInterface
{
  name = 'AddColumnAvailableQuantityToTableProduct1746613497091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD "available_quantity" integer NOT NULL DEFAULT '1'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "available_quantity"
        `);
  }
}
