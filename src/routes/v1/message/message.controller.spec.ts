import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './message.service';
import { MessagesController } from './message.controller';
import { Response } from 'express';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { Message } from './entities/message.entity';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { HttpException } from '@nestjs/common';

describe('MessagesController', () => {
  let controller: MessagesController;
  let mockMessageService: jest.MockedObject<Partial<MessagesService>>;
  let mockResponse: Response;
  const mockMessage = { id: 1, content: 'Test message', createdAt: new Date() };

  beforeEach(async () => {
    mockMessageService = {
      getAllMessages: jest.fn(),
      getMessageById: jest.fn(),
      createMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [MessagesService, { provide: MessagesService, useValue: mockMessageService }],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get all messages', () => {
    it('Should return an array of messages', async () => {
      mockMessageService.getAllMessages.mockResolvedValue([mockMessage]);
      const response: ResponseData<Message[]> = await controller.getAllMessages();

      expect(response).toStrictEqual([mockMessage]);
    });

    it('Should be able to handle exceptions', async () => {
      mockMessageService.getAllMessages.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.getAllMessages()).rejects.toThrow(HttpException);
    });
  });

  describe('Get message by id', () => {
    it('Should return a message by ID', async () => {
      mockMessageService.getMessageById.mockResolvedValue(mockMessage);
      const response: ResponseData<Message> = await controller.getMessageById(1);

      expect(response).toStrictEqual(mockMessage);
    });

    it('Should return NotFound if no message found against an ID', async () => {
      mockMessageService.getMessageById.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.MESSAGE_NOT_FOUND));
      expect(controller.getMessageById(mockMessage.id)).rejects.toThrow(Exception);
    });

    it('Should be able to handle exceptions', async () => {
      mockMessageService.getMessageById.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.getMessageById(mockMessage?.id)).rejects.toThrow(HttpException);
    });
  });

  describe('Create message', () => {
    it('Should create a new message', async () => {
      const mockResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.MESSAGE_CREATED };
      mockMessageService.createMessage.mockResolvedValue(mockResponse);
      const message: ResponseData<MessageResponse> = await controller.createMessage(mockMessage);

      expect(message).toStrictEqual(mockResponse);
    });

    it('Should be able to handle exceptions', async () => {
      mockMessageService.createMessage.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.createMessage(mockMessage)).rejects.toThrow(HttpException);
    });
  });
});
