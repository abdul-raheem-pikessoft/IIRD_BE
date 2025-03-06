import { Module } from '@nestjs/common';
import { UserRolePermissionController } from './user-role-permission.controller';
import { UserRolePermissionService } from './user-role-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/roles.entity';
import { Permission } from '../permissions/entities/permissions.entity';
import { UserRolePermission } from './entities/user-role.entity';
import { UserRolePermissionRepository } from './user-role-permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRolePermission, User, Role, Permission])],
  controllers: [UserRolePermissionController],
  providers: [UserRolePermissionService, UserRolePermissionRepository],
  exports: [UserRolePermissionService],
})
export class UserRolePermissionModule {}
