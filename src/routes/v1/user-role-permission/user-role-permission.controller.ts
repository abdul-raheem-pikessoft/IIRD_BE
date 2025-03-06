import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserRolePermissionService } from './user-role-permission.service';
import { CreateUserRoleDto } from './dto/create-user-role-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { ResponseData } from 'src/types/response.type';
import { UserRolePermission } from './entities/user-role.entity';

@ApiBearerAuth()
@ApiTags('User Role Permission')
@Controller('user-role-permission')
export class UserRolePermissionController {
  constructor(private readonly UserRolePermissionService: UserRolePermissionService) {}

  @Post()
  async createRolePermission(@Body() body: CreateUserRoleDto): Promise<ResponseData<UserRolePermission>> {
    try {
      return await this.UserRolePermissionService.create(body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Get('role/:userId')
  async getRolesOfUser(@Param('userId', new ParseIntPipe()) userId: number): Promise<ResponseData<UserRolePermission[]>> {
    try {
      return await this.UserRolePermissionService.getRolesOfUser(userId);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Get('permissions/:userId')
  async getPermissionsOfUser(@Param('userId', new ParseIntPipe()) userId: number): Promise<ResponseData<UserRolePermission[]>> {
    try {
      return await this.UserRolePermissionService.getPermissionsOfUser(userId);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw new Exception(err?.message, err?.status);
    }
  }
}
