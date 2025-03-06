import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MessagesService } from './message.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { NoAuth } from '../auth/strategy/no-auth.guard';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { Message } from './entities/message.entity';
import { ControllerNameEnum } from '../../../enums/global.enum';

@ApiBearerAuth()
@ApiTags('Messages')
@Controller(ControllerNameEnum.MESSAGES)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @NoAuth()
  async getAllMessages(): Promise<ResponseData<Message[]>> {
    try {
      return await this.messagesService.getAllMessages();
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @Get(':id')
  @NoAuth()
  async getMessageById(@Param('id', new ParseIntPipe()) id: number): Promise<ResponseData<Message>> {
    try {
      return await this.messagesService.getMessageById(Number(id));
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }

  @Post()
  @NoAuth()
  async createMessage(@Body() messageDto: CreateMessageDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.messagesService.createMessage(messageDto.content);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status, err?.additionalArgs);
    }
  }
}
