import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderRelatedTable1746956199880
  implements MigrationInterface
{
  name = 'CreateOrderRelatedTable1746956199880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "logistic_tracking_info" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "logistic_provider" character varying(100) NOT NULL,
                "tracking_code" character varying(100) NOT NULL,
                "tracking_url" text,
                "estimated_deliver_date" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_e5fbec5d24a0d1d787a8ca7bf81" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "logistic_info" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "street_line_1" text NOT NULL,
                "street_line_2" text,
                "street_line_3" text,
                "postal_code" integer NOT NULL,
                "city" character varying(100) NOT NULL,
                "country" character varying(60) NOT NULL,
                "recipient" character varying(100) NOT NULL,
                "country_code" integer NOT NULL,
                "contact_number" integer NOT NULL,
                "logistic_tracking_info" uuid,
                CONSTRAINT "REL_98e313b6c630549923cf74e6b4" UNIQUE ("logistic_tracking_info"),
                CONSTRAINT "PK_8fac5b2bb4d651c1143774f4573" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "order" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "quantity" integer NOT NULL DEFAULT '1',
                "data_key" character(44),
                "total_amount_in_lamport" bigint NOT NULL,
                "product_uuid" uuid NOT NULL,
                "logistic_info_uuid" uuid NOT NULL,
                CONSTRAINT "REL_a1a52dbef80eab2984a399d023" UNIQUE ("logistic_info_uuid"),
                CONSTRAINT "PK_ba94d4066f76b66d3fe0b94c283" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "priceInLamport"
        `);
    await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "isPublish"
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD "price_in_micro_usdc" bigint NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD "is_publish" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "logistic_info"
            ADD CONSTRAINT "FK_98e313b6c630549923cf74e6b45" FOREIGN KEY ("logistic_tracking_info") REFERENCES "logistic_tracking_info"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_0dd815255557b1f5eb43094680a" FOREIGN KEY ("product_uuid") REFERENCES "product"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_a1a52dbef80eab2984a399d0239" FOREIGN KEY ("logistic_info_uuid") REFERENCES "logistic_info"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "FK_a1a52dbef80eab2984a399d0239"
        `);
    await queryRunner.query(`
            ALTER TABLE "order" DROP CONSTRAINT "FK_0dd815255557b1f5eb43094680a"
        `);
    await queryRunner.query(`
            ALTER TABLE "logistic_info" DROP CONSTRAINT "FK_98e313b6c630549923cf74e6b45"
        `);
    await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "is_publish"
        `);
    await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "price_in_micro_usdc"
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD "isPublish" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD "priceInLamport" bigint NOT NULL
        `);
    await queryRunner.query(`
            DROP TABLE "order"
        `);
    await queryRunner.query(`
            DROP TABLE "logistic_info"
        `);
    await queryRunner.query(`
            DROP TABLE "logistic_tracking_info"
        `);
  }
}
