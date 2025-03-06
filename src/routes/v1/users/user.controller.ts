import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../../decorators/permissions.decorator';
import { PermissionsEnum } from '../../../enums/permissions.enum';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { ListingResponseData, MessageResponse, ResponseData } from '../../../types/response.type';
import { NoAuth } from '../auth/strategy/no-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ControllerNameEnum } from '../../../enums/global.enum';
import { Request } from 'express';
import { UserWithRolePermissions } from '../../../types/user.type';

@ApiBearerAuth()
@ApiTags('User')
@Controller(ControllerNameEnum.USERS)
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionsEnum.CREATE_USER)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.userService.create(createUserDto);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionsEnum.VIEW_USER)
  async findAll(): Promise<ListingResponseData<User>> {
    try {
      return await this.userService.findAll();
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number): Promise<ResponseData<User>> {
    try {
      const user = req?.user as UserWithRolePermissions;

      return await this.userService.findOneByProperties({ id }, user);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<ResponseData<MessageResponse>> {
    try {
      const user = req?.user as UserWithRolePermissions;

      return await this.userService.update(id, body as User, user);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Permissions(PermissionsEnum.DELETE_USER)
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.userService.remove(id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @NoAuth()
  @ApiQuery({ required: true, name: 'email' })
  @Get('two/factor')
  async verifyEmail(@Query('email') email: string): Promise<ResponseData<MessageResponse>> {
    try {
      const encodedEmail = decodeURIComponent(email);

      return await this.userService.verifyEmail(encodedEmail);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }
}
