import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Mocked } from 'src/types/test.type';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListingResponseData, MessageResponse } from '../../../types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { HttpException } from '@nestjs/common';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

describe('NotificationController', () => {
  let controller: NotificationController;
  let mockNotificationService: Mocked<NotificationService>;
  let mockNotification: Notification;

  beforeEach((): void => {
    mockNotification = {
      id: 1,
      message: 'Sample notification',
      notificationType: 'info',
      userId: 1,
    } as Notification;
  });

  beforeEach(async (): Promise<void> => {
    mockNotificationService = {
      createNotification: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findOneByProperties: jest.fn(),
      remove: jest.fn(),
      removeByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createNotificationDto: CreateNotificationDto = {
      message: 'Sample notification',
      notificationType: 'info',
      userId: 1,
    };

    it('should create a notification', async (): Promise<void> => {
      const expectedResult: MessageResponse = { message: ResponseMessageConstant?.NOTIFICATION_CREATED };
      mockNotificationService.createNotification.mockResolvedValueOnce(expectedResult);
      const result: MessageResponse = await controller.create(createNotificationDto);

      expect(result).toEqual(expectedResult);
    });

    it('should handle exception', async (): Promise<void> => {
      mockNotificationService.createNotification.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(controller.create(createNotificationDto)).rejects.toThrowError(HttpException);
    });
  });

  describe('findAll', () => {
    it('should find all notifications', async (): Promise<void> => {
      mockNotificationService.findAll.mockResolvedValue({ records: [mockNotification], count: 1 });
      const result: ListingResponseData<Notification> = await controller.findAll();

      expect(result).toEqual({ records: [mockNotification], count: 1 });
    });

    it('should handle exception', async () => {
      mockNotificationService.findAll.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(controller.findAll()).rejects.toThrowError(HttpException);
    });
  });

  describe('findByUserId', () => {
    it('should find notifications by user ID', async (): Promise<void> => {
      mockNotificationService.findByUserId.mockResolvedValue([mockNotification]);
      const result: Notification[] = await controller.findByUserId(mockNotification?.userId);

      expect(result).toEqual([mockNotification]);
    });

    it('should handle NotFoundException if no notifications found for user ID', async () => {
      mockNotificationService.findByUserId.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.NOTIFICATIONS_NOT_FOUND));

      await expect(controller.findByUserId(mockNotification?.userId)).rejects.toThrowError(Exception);
    });

    it('should handle exception', async (): Promise<void> => {
      mockNotificationService.findByUserId.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(controller.findByUserId(mockNotification?.userId)).rejects.toThrowError(HttpException);
    });
  });

  describe('findOne', () => {
    it('should find a notification by ID', async (): Promise<void> => {
      mockNotificationService.findOneByProperties.mockResolvedValue(mockNotification);
      const result = await controller.findOne(mockNotification?.id);

      expect(result).toEqual(mockNotification);
    });

    it('should handle NotFoundException if notification not found', async (): Promise<void> => {
      mockNotificationService.findOneByProperties.mockRejectedValue(
        new NotFoundException(ExceptionMessageConstant?.NOTIFICATIONS_NOT_FOUND),
      );

      await expect(controller.findOne(mockNotification?.id)).rejects.toThrowError(Exception);
    });

    it('should handle exception', async (): Promise<void> => {
      mockNotificationService.findOneByProperties.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(controller.findOne(mockNotification?.id)).rejects.toThrowError(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a notification by ID', async (): Promise<void> => {
      const expectedResult: MessageResponse = { message: ResponseMessageConstant.NOTIFICATION_REMOVED };
      mockNotificationService.remove.mockResolvedValue(expectedResult);
      const result = await controller.remove(mockNotification?.id);

      expect(result).toEqual(expectedResult);
    });

    it('should handle NotFoundException if notification not found', async (): Promise<void> => {
      mockNotificationService.remove.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.NOTIFICATIONS_NOT_FOUND));

      await expect(controller.remove(mockNotification?.id)).rejects.toThrowError(Exception);
    });

    it('should handle exception', async (): Promise<void> => {
      mockNotificationService.remove.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(controller.remove(mockNotification?.id)).rejects.toThrowError(HttpException);
    });
  });

  describe('removeByUserId', () => {
    it('should remove notifications by user ID', async (): Promise<void> => {
      const expectedResult: MessageResponse = { message: ResponseMessageConstant.NOTIFICATIONS_REMOVED };
      mockNotificationService.removeByUserId.mockResolvedValue(expectedResult);
      const result: MessageResponse = await controller.removeByUserId(mockNotification?.userId);

      expect(result).toEqual(expectedResult);
    });

    it('should handle NotFoundException if no notifications found for user ID', async (): Promise<void> => {
      mockNotificationService.removeByUserId.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.NOTIFICATIONS_NOT_FOUND));

      await expect(controller.removeByUserId(mockNotification?.id)).rejects.toThrowError(Exception);
    });

    it('should handle exception', async (): Promise<void> => {
      mockNotificationService.removeByUserId.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(controller.removeByUserId(mockNotification?.userId)).rejects.toThrowError(HttpException);
    });
  });
});
