import { DeleteResult, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrimitiveType } from 'src/types/global.types';
import { FindAllQueryResponse } from 'src/types/response.type';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  findOneByProp(props: Partial<User>): Promise<User> {
    return this.repository.findOne({
      where: { ...(props as FindOptionsWhere<PrimitiveType<User>>) },
      relations: [
        'userRolePermission',
        'userRolePermission.role',
        'userRolePermission.permission',
        'userRolePermission.role.rolePermission',
        'userRolePermission.role.rolePermission.permission',
      ],
    });
  }

  findOneWithExcludedProperties(props: Partial<User>): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where(props as FindOptionsWhere<PrimitiveType<User>>)
      .getOne();
  }

  createUser(user: User): User {
    return this.repository.create(user);
  }

  saveUser(user: User) {
    return this.repository.save(user);
  }

  findAll(): Promise<FindAllQueryResponse<User>> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRolePermission', 'userRolePermission')
      .leftJoinAndSelect('userRolePermission.permission', 'permission')
      .leftJoinAndSelect('userRolePermission.role', 'role')
      .where('user.id is not null')
      .orderBy('user.id')
      .getManyAndCount();
  }

  deleteBy(prop: FindOptionsWhere<Partial<User>>): Promise<DeleteResult> {
    return this.repository.delete(prop);
  }
}
