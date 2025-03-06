import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../../../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { UserRolePermissionModule } from '../user-role-permission/user-role-permission.module';
import { UserTokensModule } from '../user-tokens/user-tokens.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserTokensModule,
    UserRolePermissionModule,
    RoleModule,
    PermissionsModule,
    RolePermissionModule,
    forwardRef(() => AuthModule),
    JwtModule.register({}),
    EmailModule,
  ],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
