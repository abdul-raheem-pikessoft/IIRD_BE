import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../role/entities/roles.entity';
import { Permission } from './entities/permissions.entity';
import { PermissionsRepository } from './permissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role])],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsRepository, PermissionsService],
})
export class PermissionsModule {}
