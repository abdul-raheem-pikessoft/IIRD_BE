import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { Message } from './entities/message.entity';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessageRepository) {}

  async getAllMessages(): Promise<ResponseData<Message[]>> {
    try {
      return await this.messagesRepository.find();
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async getMessageById(id: number): Promise<ResponseData<Message>> {
    try {
      const message: Message = await this.messagesRepository.findOne({ id });

      if (message) {
        return message;
      }

      throw new NotFoundException(ExceptionMessageConstant?.MESSAGE_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async createMessage(content: string): Promise<ResponseData<MessageResponse>> {
    try {
      const newMessage: Message = this.messagesRepository.create({ content });
      await this.messagesRepository.save(newMessage);

      return { message: ResponseMessageConstant?.MESSAGE_CREATED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
}
