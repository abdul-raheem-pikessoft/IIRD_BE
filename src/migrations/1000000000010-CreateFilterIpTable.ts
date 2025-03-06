import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilterIpTable1000000000010 implements MigrationInterface {
  name = 'CreateFilterIpTable1000000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "filter_ip" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "isBlocked" boolean NOT NULL DEFAULT true, "permanentlyBlocked" boolean NOT NULL DEFAULT false, "blockedUntil" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0ac1c654079439f6cd3061c45cd" UNIQUE ("address"), CONSTRAINT "PK_3f7de3e718155864a82a24fabaf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "filter_ip"`);
  }
}
