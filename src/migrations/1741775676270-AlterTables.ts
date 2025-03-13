import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTables1741775676270 implements MigrationInterface {
    name = 'AlterTables1741775676270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_68e27fc8d8b221ba497b13c3119"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "storage_preference" TO "isTwoFactorAuth"`);
        await queryRunner.query(`ALTER TYPE "public"."users_storage_preference_enum" RENAME TO "users_istwofactorauth_enum"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "appComponentId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isTwoFactorAuth"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isTwoFactorAuth" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."users_languagepreference_enum" RENAME TO "users_languagepreference_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_languagepreference_enum" AS ENUM('en')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "languagePreference" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "languagePreference" TYPE "public"."users_languagepreference_enum" USING "languagePreference"::"text"::"public"."users_languagepreference_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "languagePreference" SET DEFAULT 'en'`);
        await queryRunner.query(`DROP TYPE "public"."users_languagepreference_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_languagepreference_enum_old" AS ENUM('en', 'ar')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "languagePreference" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "languagePreference" TYPE "public"."users_languagepreference_enum_old" USING "languagePreference"::"text"::"public"."users_languagepreference_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "languagePreference" SET DEFAULT 'en'`);
        await queryRunner.query(`DROP TYPE "public"."users_languagepreference_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_languagepreference_enum_old" RENAME TO "users_languagepreference_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isTwoFactorAuth"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isTwoFactorAuth" "public"."users_istwofactorauth_enum" NOT NULL DEFAULT 'aws_s3'`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "appComponentId" integer`);
        await queryRunner.query(`ALTER TYPE "public"."users_istwofactorauth_enum" RENAME TO "users_storage_preference_enum"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isTwoFactorAuth" TO "storage_preference"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_68e27fc8d8b221ba497b13c3119" FOREIGN KEY ("appComponentId") REFERENCES "app_components"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
