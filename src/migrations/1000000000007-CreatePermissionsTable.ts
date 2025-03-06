import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionsTable1000000000007 implements MigrationInterface {
  name = 'CreatePermissionsTable1000000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" citext NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "appComponentId" integer, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_68e27fc8d8b221ba497b13c3119" FOREIGN KEY ("appComponentId") REFERENCES "app_components"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_68e27fc8d8b221ba497b13c3119"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
