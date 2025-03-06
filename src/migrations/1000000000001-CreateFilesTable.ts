import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilesTable1000000000001 implements MigrationInterface {
  name = 'CreateFilesTable1000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL NOT NULL, "key" character varying, "type" character varying, "originalName" character varying, "mimetype" character varying, "filePath" character varying, "versions" jsonb NOT NULL DEFAULT '[]', "userId" integer, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
