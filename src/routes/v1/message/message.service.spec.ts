import { Test, TestingModule } from '@nestjs/testing';
import { MessageRepository } from './message.repository';
import { MessagesService } from './message.service';
import { Message } from './entities/message.entity';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';

describe('MessagesService', () => {
  let service: MessagesService;
  const mockMessage: Message = { id: 1, content: 'Message 1', createdAt: new Date() };
  let mockMessageRepository: jest.MockedObject<Partial<MessageRepository>>;

  beforeEach(async () => {
    mockMessageRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService, { provide: MessageRepository, useValue: mockMessageRepository }],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  describe('Get all messages', () => {
    it('Should return all messages', async () => {
      mockMessageRepository.find.mockResolvedValue([mockMessage]);
      const response: ResponseData<Message[]> = await service.getAllMessages();

      expect(response).toStrictEqual([mockMessage]);
    });

    it('Should handle the exceptions', () => {
      mockMessageRepository.find.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.getAllMessages).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get message by id', () => {
    it('should return a message by id', async () => {
      mockMessageRepository.findOne.mockResolvedValue(mockMessage);
      const response: ResponseData<Message> = await service.getMessageById(1);

      expect(response).toStrictEqual(mockMessage);
    });

    it('should return NotFound if message is not found', async () => {
      mockMessageRepository.findOne.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.MESSAGE_NOT_FOUND));
      expect(service.getMessageById(mockMessage?.id)).rejects.toThrow(Exception);
    });

    it('Should handle the exceptions', () => {
      mockMessageRepository.findOne.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.getMessageById).rejects.toThrow(UnhandledException);
    });
  });

  describe('Create message', () => {
    it('should create a new message', async () => {
      const mockResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.MESSAGE_CREATED };
      mockMessageRepository.create.mockReturnValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue(mockMessage);
      const response = await service.createMessage('new mock message');

      expect(response).toStrictEqual(mockResponse);
    });

    it('Should handle the exceptions', () => {
      mockMessageRepository.save.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.createMessage).rejects.toThrow(UnhandledException);
    });
  });
});
