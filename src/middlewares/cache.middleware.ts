import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, NestMiddleware } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PermissionsRepository } from 'src/routes/v1/permissions/permissions.repository';
import { RoleRepository } from 'src/routes/v1/role/role.repository';
import { UserService } from 'src/routes/v1/users/user.service';
import { ControllerNameEnum } from '../enums/global.enum';

export class CacheMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    @Inject(RoleRepository) private roleRepository: RoleRepository,
    @Inject(PermissionsRepository) private permissionRepository: PermissionsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  appRepos = {
    [ControllerNameEnum.USERS]: this.userService,
    [ControllerNameEnum.ROLES]: this.roleRepository,
    [ControllerNameEnum.PERMISSIONS]: this.permissionRepository,
  };

  async use(req: any, res: any, next: (error?: any) => void): Promise<void> {
    res.on('finish', async () => {
      const route: string = req?.url?.split('/')?.[2];
      const updatedRecord = await this.appRepos?.[route]?.findAll();
      const response = updatedRecord?.content || updatedRecord;
      this.cacheManager.set(route, response);
    });
    next();
  }
}
