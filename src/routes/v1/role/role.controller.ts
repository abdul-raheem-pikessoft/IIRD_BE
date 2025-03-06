import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { Role } from './entities/roles.entity';
import { Permissions } from '../../../decorators/permissions.decorator';
import { PermissionsEnum } from '../../../enums/permissions.enum';
import { ControllerNameEnum } from '../../../enums/global.enum';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller(ControllerNameEnum.ROLES)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permissions(PermissionsEnum.VIEW_ROLE)
  async getAllRoles(): Promise<ResponseData<Role[]>> {
    try {
      return await this.roleService.findAllRoles();
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Post()
  @Permissions(PermissionsEnum.CREATE_ROLE)
  async createRole(@Body() body: CreateRoleDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.roleService.createRole(body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Get(':id')
  @Permissions(PermissionsEnum.VIEW_ROLE)
  async getRole(@Param('id', new ParseIntPipe()) id: number): Promise<ResponseData<Role>> {
    try {
      return await this.roleService.findRoleById(id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.DELETE_ROLE)
  async deleteRole(@Param('id', new ParseIntPipe()) id: number): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.roleService.deleteById(id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Patch(':id')
  @Permissions(PermissionsEnum.UPDATE_ROLE)
  async updateRole(@Param('id', new ParseIntPipe()) id: number, @Body() body: UpdateRoleDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.roleService.updateById(id, body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }
}
