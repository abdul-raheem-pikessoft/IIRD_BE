import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRolePermissionsTable1000000000009 implements MigrationInterface {
  name = 'CreateUserRolePermissionsTable1000000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_role_permissions" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "roleId" integer, "permissionId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_420a5fa7fb38a884be42c60903e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_permissions" ADD CONSTRAINT "FK_c71e30123b2f74875093e6087a9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_permissions" ADD CONSTRAINT "FK_4eb5a06d455bbb8da0c0a67d37a" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_permissions" ADD CONSTRAINT "FK_c46e4a453971e1071ae371e999b" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role_permissions" DROP CONSTRAINT "FK_c46e4a453971e1071ae371e999b"`);
    await queryRunner.query(`ALTER TABLE "user_role_permissions" DROP CONSTRAINT "FK_4eb5a06d455bbb8da0c0a67d37a"`);
    await queryRunner.query(`ALTER TABLE "user_role_permissions" DROP CONSTRAINT "FK_c71e30123b2f74875093e6087a9"`);
    await queryRunner.query(`DROP TABLE "user_role_permissions"`);
  }
}
