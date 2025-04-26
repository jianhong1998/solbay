import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1745120225133 implements MigrationInterface {
  name = 'CreateUserTable1745120225133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "public_key" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_95346651704b18bcd60d5c2e83d" UNIQUE ("public_key"),
                CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
