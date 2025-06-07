import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTempOrderTable1749081119842 implements MigrationInterface {
  name = 'CreateTempOrderTable1749081119842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temp_order" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "buyerUuid" uuid NOT NULL,
                "orderUuid" uuid NOT NULL,
                CONSTRAINT "REL_4450817838fe0e0476f1dee54b" UNIQUE ("orderUuid"),
                CONSTRAINT "PK_f1384d16247a837880c493d8f4e" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_4450817838fe0e0476f1dee54b" ON "temp_order" ("orderUuid")
        `);
    await queryRunner.query(`
            ALTER TABLE "temp_order"
            ADD CONSTRAINT "FK_530865b8f38fead8ed15514fa05" FOREIGN KEY ("buyerUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "temp_order"
            ADD CONSTRAINT "FK_4450817838fe0e0476f1dee54ba" FOREIGN KEY ("orderUuid") REFERENCES "order"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "temp_order" DROP CONSTRAINT "FK_4450817838fe0e0476f1dee54ba"
        `);
    await queryRunner.query(`
            ALTER TABLE "temp_order" DROP CONSTRAINT "FK_530865b8f38fead8ed15514fa05"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4450817838fe0e0476f1dee54b"
        `);
    await queryRunner.query(`
            DROP TABLE "temp_order"
        `);
  }
}
