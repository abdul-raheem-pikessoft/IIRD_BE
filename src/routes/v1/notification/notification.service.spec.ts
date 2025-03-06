import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { Mocked } from 'src/types/test.type';
import { Notification } from './entities/notification.entity';
import { ListingResponseData, MessageResponse, ResponseData } from 'src/types/response.type';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';

describe('NotificationService', () => {
  let mockNotificationRepository: Mocked<NotificationRepository>;
  let service: NotificationService;
  let mockNotification: Notification;

  beforeEach((): void => {
    mockNotification = {
      id: 1,
      message: 'sampleMessage',
      notificationType: 'sampleType',
      userId: 1,
    } as Notification;
  });

  beforeEach(async () => {
    mockNotificationRepository = {
      saveNotification: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findOneByProp: jest.fn(),
      deleteBy: jest.fn(),
      deleteByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Notification', (): void => {
    it('Should create notification', async (): Promise<void> => {
      mockNotificationRepository.saveNotification.mockResolvedValue(mockNotification);
      const response: ResponseData<MessageResponse> = await service.createNotification(mockNotification as CreateNotificationDto);

      expect(response).toStrictEqual({ message: ResponseMessageConstant?.NOTIFICATION_CREATED });
    });

    it('Should throw Unhandled Exception in case of exception', (): void => {
      mockNotificationRepository.saveNotification.mockRejectedValue(new Error('unhandled exception'));

      expect(service.createNotification(mockNotification)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find All Notifications', (): void => {
    it('should find all notifications', async (): Promise<void> => {
      mockNotificationRepository.findAll.mockResolvedValue([[mockNotification], 1]);
      const response: ListingResponseData<Notification> = await service.findAll();

      expect(response).toStrictEqual({ count: 1, records: [mockNotification] });
    });

    it('should throw Unhandled Exception in case of exception', (): void => {
      mockNotificationRepository.findAll.mockRejectedValue(new Error('unhandled exception'));

      expect(service.findAll()).rejects.toThrow(UnhandledException);
    });
  });

  describe('FindByUserId', () => {
    it('should find notifications by user ID', async (): Promise<void> => {
      mockNotificationRepository.findByUserId.mockResolvedValue([mockNotification]);
      const result: Notification[] = await service.findByUserId(mockNotification.userId);

      expect(result).toEqual([mockNotification]);
    });

    it('should throw NotFoundException if no notifications found for user ID', async (): Promise<void> => {
      mockNotificationRepository.findByUserId.mockResolvedValue([]);

      await expect(service.findByUserId(mockNotification?.userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnhandledException in case of exception', async (): Promise<void> => {
      mockNotificationRepository.findByUserId.mockRejectedValue(new Error('Unhandled exception'));

      await expect(service.findByUserId(mockNotification?.userId)).rejects.toThrow(UnhandledException);
    });
  });

  describe('FindOneByProperties', () => {
    const props = { id: 1 };
    it('should find a notification by properties', async (): Promise<void> => {
      mockNotificationRepository.findOneByProp.mockResolvedValue(mockNotification);
      const result: Notification = await service.findOneByProperties(props);

      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if no notification found with given properties', async (): Promise<void> => {
      mockNotificationRepository.findOneByProp.mockResolvedValue(null);

      await expect(service.findOneByProperties(props)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnhandledException in case of exception', async (): Promise<void> => {
      mockNotificationRepository.findOneByProp.mockRejectedValue(new Error('Unhandled exception'));

      await expect(service.findOneByProperties(props)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Remove', () => {
    it('should remove a notification by ID', async (): Promise<void> => {
      mockNotificationRepository.findOneByProp.mockResolvedValue(mockNotification);
      const result: MessageResponse = await service.remove(mockNotification?.id);

      expect(result.message).toBe(ResponseMessageConstant.NOTIFICATION_REMOVED);
    });

    it('should throw NotFoundException if notification not found', async (): Promise<void> => {
      mockNotificationRepository.findOneByProp.mockResolvedValue(null);

      await expect(service.remove(mockNotification?.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnhandledException in case of exception', async (): Promise<void> => {
      mockNotificationRepository.findOneByProp.mockRejectedValue(new Error('Unhandled exception'));

      await expect(service.remove(mockNotification?.id)).rejects.toThrow(UnhandledException);
    });
  });

  describe('RemoveByUserId', () => {
    it('should remove notifications by user ID', async (): Promise<void> => {
      mockNotificationRepository.findByUserId.mockResolvedValue([mockNotification]);
      const result: MessageResponse = await service.removeByUserId(mockNotification?.userId);

      expect(result.message).toBe(ResponseMessageConstant.NOTIFICATIONS_REMOVED);
    });

    it('should throw NotFoundException if no notifications found for user ID', async (): Promise<void> => {
      mockNotificationRepository.findByUserId.mockResolvedValue([]);

      await expect(service.removeByUserId(mockNotification?.userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnhandledException in case of exception', async (): Promise<void> => {
      mockNotificationRepository.findByUserId.mockRejectedValue(new Error('Unhandled exception'));

      await expect(service.removeByUserId(mockNotification?.userId)).rejects.toThrow(UnhandledException);
    });
  });
});
