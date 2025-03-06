import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageRepository {
  constructor(@InjectRepository(Message) private readonly repository: Repository<Message>) {}

  create(message: Partial<Message>): Message {
    return this.repository.create(message);
  }

  save(message: Partial<Message>): Promise<Message> {
    return this.repository.save(message);
  }

  find(): Promise<Message[]> {
    return this.repository.find();
  }

  findOne(prop: Partial<Message>): Promise<Message> {
    return this.repository.findOneBy({ ...prop });
  }
}
