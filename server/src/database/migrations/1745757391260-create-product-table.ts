import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1745757391260 implements MigrationInterface {
  name = 'CreateProductTable1745757391260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "priceInLamport" bigint NOT NULL,
                "isPublish" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "seller_id" uuid NOT NULL,
                CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_79a3ae0442388a2418ec67a3120" FOREIGN KEY ("seller_id") REFERENCES "seller"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product" DROP CONSTRAINT "FK_79a3ae0442388a2418ec67a3120"
        `);
    await queryRunner.query(`
            DROP TABLE "product"
        `);
  }
}
