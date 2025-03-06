import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTokensTable1000000000003 implements MigrationInterface {
  name = 'CreateUserTokensTable1000000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_tokens_type_enum" AS ENUM('invite_token', 'refresh_token', 'hashed_refresh_token', 'access_token', 'forgot_password', 'login_otp', 'forgot_password_otp', 'block_user', 'set_password')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" SERIAL NOT NULL, "token" character varying, "otp" character varying, "type" "public"."user_tokens_type_enum" NOT NULL, "key" character varying, "blockedUntil" TIMESTAMP, "uuid" character varying, "expiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_92ce9a299624e4c4ffd99b645b6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_92ce9a299624e4c4ffd99b645b6"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
    await queryRunner.query(`DROP TYPE "public"."user_tokens_type_enum"`);
  }
}
