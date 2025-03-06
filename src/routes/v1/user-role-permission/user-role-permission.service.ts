import { Injectable } from '@nestjs/common';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { AssignRolesDTO } from './dto/assign-user-role.dto';
import { CreateUserRoleDto } from './dto/create-user-role-permission.dto';
import { UserRolePermissionRepository } from './user-role-permission.repository';
import { AssignPermissionsDTO } from './dto/assign-user-permissions.dto';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { UserRolePermission } from './entities/user-role.entity';
import { UserSpecificPermissionDto } from './dto/user-specific.permission.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

@Injectable()
export class UserRolePermissionService {
  constructor(private readonly repository: UserRolePermissionRepository) {}

  async create(data: CreateUserRoleDto): Promise<ResponseData<UserRolePermission>> {
    try {
      const userRolePermission: UserRolePermission = this.repository.create(data);

      return await this.repository.save(userRolePermission);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findAllRolePermissions(): Promise<ResponseData<UserRolePermission[]>> {
    try {
      return await this.repository.findAll();
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findRolePermissionById(id: number): Promise<ResponseData<UserRolePermission>> {
    try {
      const userRolePermission: UserRolePermission = await this.repository.findById(id);

      if (userRolePermission) {
        return userRolePermission;
      }

      throw new NotFoundException(ExceptionMessageConstant.NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant?.NOT_FOUND);
      }

      throw new UnhandledException(err?.message);
    }
  }

  async findRolePermissionByUser(userId: number): Promise<ResponseData<UserRolePermission[]>> {
    try {
      const userRolePermission: UserRolePermission[] = await this.repository.findByUserId(userId);

      if (userRolePermission.length) {
        return userRolePermission;
      }

      throw new NotFoundException(ExceptionMessageConstant.NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant?.NOT_FOUND);
      }

      throw new UnhandledException(err?.message);
    }
  }

  async getRolesOfUser(userId: number): Promise<ResponseData<UserRolePermission[]>> {
    try {
      const userRoles: UserRolePermission[] = await this.repository.getRolesOfUser(userId);

      if (userRoles.length) {
        return userRoles;
      }

      throw new NotFoundException(ExceptionMessageConstant.ROLE_NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant?.NOT_FOUND);
      }

      throw new UnhandledException(err?.message);
    }
  }

  async getPermissionsOfUser(userId: number): Promise<ResponseData<UserRolePermission[]>> {
    try {
      const userPermissions: UserRolePermission[] = await this.repository.getPermissionsOfUser(userId);

      if (userPermissions.length) {
        return userPermissions;
      }

      throw new NotFoundException(ExceptionMessageConstant.PERMISSION_NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant?.NOT_FOUND);
      }

      throw new UnhandledException(err?.message);
    }
  }

  async assignRoles(body: AssignRolesDTO): Promise<ResponseData<MessageResponse>> {
    try {
      for (const role of body.roles) {
        await this.repository.save({ userId: body.userId, roleId: role });
      }

      return { message: ResponseMessageConstant.ROLE_ASSIGNED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async assignPermissions(body: AssignPermissionsDTO): Promise<ResponseData<MessageResponse>> {
    try {
      for (const permission of body.permissions) {
        await this.repository.save({ userId: body.userId, permissionId: permission });
      }

      return { message: ResponseMessageConstant.PERMISSION_ASSIGNED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async updateUserRoles(body: UpdateUserRoleDto, userId: number): Promise<ResponseData<MessageResponse>> {
    try {
      for (const id of body.deleteRoles) {
        await this.repository.deleteRoleOrPermissions({ roleId: id, userId });
      }

      for (const id of body.newRoles) {
        const roleExists = await this.repository.findByProps({ roleId: id, userId });
        if (!roleExists) {
          await this.repository.save({ roleId: id, userId });
        }
      }

      return { message: ResponseMessageConstant.USER_ROLES_UPDATED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async updateUserPermissions(body: UpdateUserPermissionDto, userId: number): Promise<ResponseData<MessageResponse>> {
    try {
      for (const id of body.deletePermissions) {
        await this.repository.deleteRoleOrPermissions({ permissionId: id, userId });
      }

      for (const id of body.newPermissions) {
        const permissionExists: UserRolePermission = await this.repository.findByProps({ permissionId: id, userId });

        if (!permissionExists) {
          await this.repository.save({ permissionId: id, userId });
        }
      }

      return { message: ResponseMessageConstant.USER_PERMISSIONS_UPDATED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findOneByProps(props: Partial<UserRolePermission>): Promise<UserRolePermission> {
    try {
      return await this.repository.findByProps(props);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findUserRolePermissionByUserAndPermissionId(props: UserSpecificPermissionDto): Promise<ResponseData<UserRolePermission>> {
    try {
      return await this.repository.findUserRolePermissionByUserAndPermissionId(props);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
}
