import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesPermission } from './entities/roles-permissions.entity';
import { Permission } from '../permissions/entities/permissions.entity';
import { Role } from '../role/entities/roles.entity';
import { RoleService } from '../role/role.service';
import { PermissionsService } from '../permissions/permissions.service';
import { RolePermissionRepository } from './role-permission.repository';
import { RoleRepository } from '../role/role.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolesPermission, Permission, Role])],
  providers: [RolePermissionsService, RoleService, PermissionsService, RolePermissionRepository, RoleRepository, PermissionsRepository],
  exports: [RolePermissionsService],
})
export class RolePermissionModule {}
