import { Module } from '@nestjs/common';
import { MessagesController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessagesService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MessageRepository } from './message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagesService, MessageGateway, MessageRepository],
  controllers: [MessagesController],
})
export class MessageModule {}
