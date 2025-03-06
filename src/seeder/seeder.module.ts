import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { dataSourceOptions } from 'src/config/db/database';
import { UserTokensModule } from 'src/routes/v1/user-tokens/user-tokens.module';
import { PermissionsModule } from 'src/routes/v1/permissions/permissions.module';
import { RolesPermission } from 'src/routes/v1/role-permission/entities/roles-permissions.entity';
import { RolePermissionModule } from 'src/routes/v1/role-permission/role-permission.module';
import { RolePermissionRepository } from 'src/routes/v1/role-permission/role-permission.repository';
import { RoleModule } from 'src/routes/v1/role/role.module';
import { UserRolePermission } from 'src/routes/v1/user-role-permission/entities/user-role.entity';
import { UserRolePermissionModule } from 'src/routes/v1/user-role-permission/user-role-permission.module';
import { UserRolePermissionRepository } from 'src/routes/v1/user-role-permission/user-role-permission.repository';
import { UserModule } from 'src/routes/v1/users/user.module';
import { SeederService } from './seeder.service';
import { User } from 'src/routes/v1/users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: ['src/**/*.entity.ts'],
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      ttl: +process.env.REDIS_TTL,
      store: redisStore,
      socket: {
        port: +process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      },
    }),
    TypeOrmModule.forFeature([User, RolesPermission, UserRolePermission]),
    UserModule,
    PermissionsModule,
    UserRolePermissionModule,
    UserTokensModule,
    RoleModule,
    RolePermissionModule,
  ],
  providers: [RolePermissionRepository, UserRolePermissionRepository, SeederService],
})
export class SeederModule {}
