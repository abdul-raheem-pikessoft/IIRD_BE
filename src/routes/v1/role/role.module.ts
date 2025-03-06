import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { Permission } from '../permissions/entities/permissions.entity';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { Role } from './entities/roles.entity';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Role, Permission]), RolePermissionModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
