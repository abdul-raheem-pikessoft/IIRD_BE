import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';
import { MessageResponse, FindAllQueryResponse, ListingResponseData, ResponseData } from 'src/types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<MessageResponse> {
    try {
      const { message, notificationType, userId } = createNotificationDto;
      const notification = new Notification();
      notification.message = message;
      notification.notificationType = notificationType;
      notification.userId = userId;
      await this.notificationRepository.saveNotification(notification);

      return { message: ResponseMessageConstant?.NOTIFICATION_CREATED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async findAll(): Promise<ListingResponseData<Notification>> {
    try {
      const [records, count]: FindAllQueryResponse<Notification> = await this.notificationRepository.findAll();

      return { records, count };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    try {
      const notifications: Notification[] = await this.notificationRepository.findByUserId(userId);

      if (notifications.length) {
        return notifications;
      }

      throw new NotFoundException(ExceptionMessageConstant?.NOTIFICATION_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async findOneByProperties(props: Partial<Notification>): Promise<Notification> {
    try {
      const notification: Notification = await this.notificationRepository.findOneByProp(props);
      if (notification) {
        return notification;
      }

      throw new NotFoundException(ExceptionMessageConstant.NOTIFICATION_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async remove(id: number): Promise<MessageResponse> {
    try {
      const notification: Notification = await this.notificationRepository.findOneByProp({ id });

      if (notification) {
        await this.notificationRepository.deleteBy({ id });

        return {
          message: ResponseMessageConstant.NOTIFICATION_REMOVED,
        };
      }

      throw new NotFoundException(ExceptionMessageConstant.NOTIFICATION_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async removeByUserId(userId: number): Promise<MessageResponse> {
    try {
      const notifications: Notification[] = await this.notificationRepository.findByUserId(userId);
      if (notifications.length) {
        await this.notificationRepository.deleteByUserId(notifications);

        return {
          message: ResponseMessageConstant.NOTIFICATIONS_REMOVED,
        };
      }

      throw new NotFoundException(ExceptionMessageConstant.NOTIFICATION_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
}
