import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppComponentsTable1000000000005 implements MigrationInterface {
  name = 'CreateAppComponentsTable1000000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app_components" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, "updatedBy" integer, CONSTRAINT "PK_f5eab62598cd77827e1df5defc4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_components"`);
  }
}
