import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { FindAllQueryResponse } from 'src/types/response.type';

@Injectable()
export class NotificationRepository {
  constructor(@InjectRepository(Notification) private readonly repository: Repository<Notification>) {}

  async saveNotification(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }

  async findAll(): Promise<FindAllQueryResponse<Notification>> {
    return this.repository.createQueryBuilder('notification').select().orderBy('id').getManyAndCount();
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.repository.find({ where: { userId: userId } });
  }

  async findOneByProp(notification: Partial<Notification>): Promise<Notification> {
    return this.repository.findOneBy({ ...(notification as FindOptionsWhere<typeof notification>) });
  }

  async deleteBy(prop: Partial<Notification>): Promise<DeleteResult> {
    return this.repository.delete(prop as FindOptionsWhere<typeof prop>);
  }

  async deleteByUserId(prop: Partial<Notification[]>): Promise<Notification[]> {
    return await this.repository.remove(prop);
  }
}
