import { Injectable } from '@nestjs/common';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { PermissionsRepository } from './permissions.repository';
import { ResponseData, MessageResponse, ListingResponseData, FindAllQueryResponse } from 'src/types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { DuplicateException, Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { Permission } from './entities/permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(private readonly repository: PermissionsRepository) {}

  async createPermission(data: CreatePermissionDTO): Promise<ResponseData<Permission>> {
    try {
      const permission: Permission = this.repository.create(data);

      return await this.repository.save(permission);
    } catch (err) {
      if (err?.message?.includes(ExceptionMessageConstant.DUPLICATE)) {
        throw new DuplicateException(ExceptionMessageConstant.PERMISSION_EXISTS);
      }
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }
      throw err;
    }
  }

  async findAllPermissions(): Promise<ListingResponseData<Permission>> {
    try {
      const [records, count]: FindAllQueryResponse<Permission> = await this.repository.findAll();

      return { records, count };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async findPermissionById(id: number): Promise<ResponseData<Permission>> {
    try {
      const permission: Permission = await this.repository.findOneByProps({ id });

      if (permission) {
        return permission;
      }

      throw new NotFoundException(ExceptionMessageConstant.PERMISSION_NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant?.PERMISSION_NOT_FOUND);
      }

      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }
      throw err;
    }
  }

  async delete(id: number): Promise<ResponseData<MessageResponse>> {
    try {
      const existingPermission: Permission = await this.repository.findOneByProps({ id });

      if (existingPermission) {
        await this.repository.deleteById(existingPermission);

        return { message: ResponseMessageConstant.PERMISSION_REMOVED };
      }

      throw new NotFoundException(ExceptionMessageConstant.PERMISSION_NOT_FOUND);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ExceptionMessageConstant?.PERMISSION_NOT_FOUND);
      }

      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }
      throw err;
    }
  }
}
