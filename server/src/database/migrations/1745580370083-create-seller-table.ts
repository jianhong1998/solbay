import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSellerTable1745580370083 implements MigrationInterface {
    name = 'CreateSellerTable1745580370083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "seller" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(50) NOT NULL,
                "email" character varying(100) NOT NULL,
                "user_uuid" uuid NOT NULL,
                CONSTRAINT "REL_14a329d95a759b1da948d4fb75" UNIQUE ("user_uuid"),
                CONSTRAINT "PK_21be3f397386231460b1063d5ed" PRIMARY KEY ("uuid")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "seller"
            ADD CONSTRAINT "FK_14a329d95a759b1da948d4fb752" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "seller" DROP CONSTRAINT "FK_14a329d95a759b1da948d4fb752"
        `);
        await queryRunner.query(`
            DROP TABLE "seller"
        `);
    }

}
