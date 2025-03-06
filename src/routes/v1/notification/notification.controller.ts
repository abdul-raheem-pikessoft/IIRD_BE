import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SentryInterceptor } from '../../../interceptors/sentry-interceptor';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { ListingResponseData, MessageResponse, ResponseData } from '../../../types/response.type';
import { Notification } from './entities/notification.entity';
import { ControllerNameEnum } from '../../../enums/global.enum';

@UseInterceptors(SentryInterceptor)
@ApiBearerAuth()
@ApiTags('Notifications')
@Controller(ControllerNameEnum.NOTIFICATIONS)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<MessageResponse> {
    try {
      return await this.notificationService.createNotification(createNotificationDto);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ListingResponseData<Notification>> {
    try {
      return await this.notificationService.findAll();
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':userId')
  async findByUserId(@Param('userId', new ParseIntPipe()) userId: number): Promise<Notification[]> {
    try {
      return await this.notificationService.findByUserId(userId);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<Notification> {
    try {
      return await this.notificationService.findOneByProperties({ id: id });
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<MessageResponse> {
    try {
      return await this.notificationService.remove(id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':userId')
  async removeByUserId(@Param('userId', new ParseIntPipe()) userId: number): Promise<MessageResponse> {
    try {
      return await this.notificationService.removeByUserId(userId);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }
}
