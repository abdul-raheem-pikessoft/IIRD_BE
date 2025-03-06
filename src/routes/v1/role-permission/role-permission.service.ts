import { Injectable } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';
import { CreateRolePermissionDto } from './dto/roles-permissions.dtos';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { RolesPermission } from './entities/roles-permissions.entity';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly repository: RolePermissionRepository) {}

  async createRolePermission(data: CreateRolePermissionDto): Promise<ResponseData<RolesPermission>> {
    try {
      const rolePermission: RolesPermission = this.repository.create(data);

      return await this.repository.save(rolePermission);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findAllRolePermissions(): Promise<ResponseData<RolesPermission[]>> {
    try {
      return await this.repository.findAll();
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findRolePermissionById(id: number): Promise<ResponseData<RolesPermission>> {
    try {
      const rolePermission: RolesPermission = await this.repository.findOneByProps({ id });
      if (rolePermission) {
        return rolePermission;
      }

      throw new NotFoundException(ExceptionMessageConstant.NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant.NOT_FOUND);
      }

      throw new UnhandledException(err?.message);
    }
  }

  async assignPermissionsToRole(permissionIds: number[], roleId: number): Promise<ResponseData<MessageResponse>> {
    try {
      for (const permissionId of permissionIds) {
        const existingPermission: RolesPermission = await this.repository.findOneByProps({ permissionId, roleId });

        if (!existingPermission) {
          await this.repository.save({ permissionId, roleId });
        }
      }

      return { message: ResponseMessageConstant.ROLE_ASSIGNED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async removePermissionsOfRole(permissions: number[], roleId: number): Promise<ResponseData<MessageResponse>> {
    try {
      await this.repository.delete(permissions, roleId);
      return { message: ResponseMessageConstant.PERMISSION_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async getPermissionsOfRole(roleId: number): Promise<ResponseData<RolesPermission[]>> {
    try {
      const rolePermissions: RolesPermission[] = await this.repository.getPermissionsOfRole(roleId);
      if (rolePermissions.length) {
        return rolePermissions;
      }

      throw new NotFoundException(ExceptionMessageConstant.PERMISSION_NOT_FOUND);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async getRolesOfPermission(permissionId: number): Promise<ResponseData<RolesPermission[]>> {
    try {
      const permissionRoles: RolesPermission[] = await this.repository.getRolesOfPermission(permissionId);
      if (permissionRoles.length) {
        return permissionRoles;
      }

      throw new NotFoundException(ExceptionMessageConstant.ROLE_NOT_FOUND);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }
}
