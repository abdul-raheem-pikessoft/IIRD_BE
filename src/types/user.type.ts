import { Permission } from '../routes/v1/permissions/entities/permissions.entity';
import { UserRolePermission } from '../routes/v1/user-role-permission/entities/user-role.entity';
import { User } from '../routes/v1/users/entities/user.entity';

export type PermissionWithRole = Permission & { roleId: number };
export type UserWithRolePermissions = User & { permissions: PermissionWithRole[]; userRolePermissions: UserRolePermission[] };

export type LoginResponse = {
  id: number;
  email: string;
  access_token: string;
  refresh_token: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
