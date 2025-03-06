import { AdminPermissions } from '../seeder/data/permissions/admin.permissions';
import { UserPermissions } from "../seeder/data/permissions/user.permissions";
import { RoleEnum } from "../enums/role.enum";

export const RolePermissionMapper: Record<RoleEnum, string[]> = {
    [RoleEnum.ADMIN]: AdminPermissions,
    [RoleEnum.USER]: UserPermissions
};

export type MappedRoles = keyof typeof RolePermissionMapper;
