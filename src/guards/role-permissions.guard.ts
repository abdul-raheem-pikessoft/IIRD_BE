import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionWithRole, UserWithRolePermissions } from '../types/user.type';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const noPermission: boolean = this.reflector.get<boolean>('no-permission', context.getHandler());
    const noAuth: boolean = this.reflector.get<boolean>('no-auth', context.getHandler());

    if (noAuth || noPermission) return true;

    const requiredPermissions: string[] = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions?.length) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request?.user as UserWithRolePermissions;
    const permissions: string[] = user?.permissions?.map((permission: PermissionWithRole) => permission?.name);
    const hasAllPermissions: boolean = requiredPermissions?.every((permission: string) => permissions?.includes(permission));

    return hasAllPermissions;
  }
}
