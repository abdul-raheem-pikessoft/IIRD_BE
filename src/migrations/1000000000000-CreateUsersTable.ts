import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1000000000000 implements MigrationInterface {
  name = 'CreateUsersTable1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_storage_preference_enum" AS ENUM('aws_s3', 'network_drive', 'azure', 'gcp')`);
    await queryRunner.query(`CREATE TYPE "public"."users_languagepreference_enum" AS ENUM('en', 'ar')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "salt" character varying, "isActive" boolean NOT NULL DEFAULT false, "googleSocialId" character varying, "facebookSocialId" character varying, "storage_preference" "public"."users_storage_preference_enum" NOT NULL DEFAULT 'aws_s3', "languagePreference" "public"."users_languagepreference_enum" NOT NULL DEFAULT 'en', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_languagepreference_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_storage_preference_enum"`);
  }
}
