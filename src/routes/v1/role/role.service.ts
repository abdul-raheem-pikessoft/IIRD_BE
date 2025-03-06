import { Injectable } from '@nestjs/common';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { RolePermissionsService } from '../role-permission/role-permission.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { ResponseData, MessageResponse } from 'src/types/response.type';
import { DuplicateException, Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { Role } from './entities/roles.entity';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository, private readonly rolePermissionService: RolePermissionsService) {}

  async createRole(data: CreateRoleDto): Promise<ResponseData<MessageResponse>> {
    try {
      const role: Role = await this.repository.create(data.name);
      await this.repository.save(role);

      if (data?.permissions?.length) {
        await this.rolePermissionService.assignPermissionsToRole(data.permissions, +role.id);
      }

      return { message: ResponseMessageConstant.ROLE_CREATED };
    } catch (err) {
      if (err?.message?.includes(ExceptionMessageConstant.DUPLICATE)) {
        throw new DuplicateException(ExceptionMessageConstant.ROLE_EXISTS);
      }

      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async findAllRoles(): Promise<ResponseData<Role[]>> {
    try {
      return await this.repository.findAll();
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async findRoleById(id: number): Promise<ResponseData<Role>> {
    try {
      const role: Role = await this.repository.findOneByProps({ id });
      if (role) {
        return role;
      }

      throw new NotFoundException(ExceptionMessageConstant.ROLE_NOT_FOUND);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async deleteById(id: number): Promise<ResponseData<MessageResponse>> {
    try {
      const roleExists: Role = await this.repository.findOneByProps({ id });

      if (roleExists) {
        await this.repository.deleteById(roleExists);

        return { message: ResponseMessageConstant.ROLE_REMOVED };
      }

      throw new NotFoundException(ExceptionMessageConstant.ROLE_NOT_FOUND);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async updateById(id: number, data: UpdateRoleDto): Promise<ResponseData<MessageResponse>> {
    try {
      const roleExists: Role = await this.repository.findOneByProps({ id });
      if (!roleExists) {
        throw new NotFoundException(ExceptionMessageConstant.ROLE_NOT_FOUND);
      }

      await this.repository.save({ ...roleExists, name: data.name });

      if (data.deletePermissions.length > 0) {
        await this.rolePermissionService.removePermissionsOfRole(data.deletePermissions, +id);
      }

      if (data.newPermissions.length > 0) {
        await this.rolePermissionService.assignPermissionsToRole(data.newPermissions, +id);
      }

      return { message: ResponseMessageConstant.ROLE_UPDATED };
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
}
