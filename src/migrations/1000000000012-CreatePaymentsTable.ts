import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1000000000012 implements MigrationInterface {
  name = 'CreatePaymentsTable1000000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "name" citext NOT NULL, "email" character varying NOT NULL, "amount" integer NOT NULL, "currencyType" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
