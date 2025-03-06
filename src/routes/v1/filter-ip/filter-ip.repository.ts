import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { FilterIP } from './entities/filter-ip.entity';

@Injectable()
export class IPRepository {
  constructor(@InjectRepository(FilterIP) private readonly repository: Repository<FilterIP>) {}

  findOneByProp(prop: Partial<FilterIP>): Promise<FilterIP> {
    return this.repository.findOneBy({ ...prop });
  }

  saveIP(filterIp: Partial<FilterIP>): Promise<Partial<FilterIP> & FilterIP> {
    return this.repository.save(filterIp);
  }

  findAll(queryParams: any): Promise<[FilterIP[], number]> {
    const qb: SelectQueryBuilder<FilterIP> = this.repository.createQueryBuilder('ip').select().orderBy('id');

    if (queryParams.blocked) {
      qb.andWhere('ip.isBlocked = :blocked', { blocked: queryParams.blocked });
    }

    if (queryParams.permanent) {
      qb.andWhere('ip.permanentlyBlocked = :permanent', { permanent: queryParams.permanent });
    }

    if (queryParams.take && (queryParams.skip || queryParams.skip === 0)) {
      qb.take(queryParams.take).skip(queryParams.skip);
    }

    return qb.getManyAndCount();
  }

  removeAllExpiredIPs(): Promise<DeleteResult> {
    const currentDateTime: Date = new Date();

    return this.repository
      .createQueryBuilder()
      .delete()
      .where({ isBlocked: true, permanentlyBlocked: false })
      .andWhere('"blockedUntil" <= :currentDateTime', { currentDateTime })
      .returning(['address', 'createdAt'])
      .execute();
  }
}
