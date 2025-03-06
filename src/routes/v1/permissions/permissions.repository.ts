import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Permission } from './entities/permissions.entity';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { FindAllQueryResponse } from 'src/types/response.type';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  create(data: CreatePermissionDTO): Permission {
    return this.repository.create(data);
  }

  save(permission: Permission): Promise<Permission> {
    return this.repository.save(permission);
  }

  findAll(): Promise<FindAllQueryResponse<Permission>> {
    return this.repository.findAndCount();
  }

  findOneByProps(prop: Partial<Permission>): Promise<Permission> {
    return this.repository.findOneBy({ ...(prop as FindOptionsWhere<typeof prop>) });
  }

  findAllByProps(prop: Partial<Record<keyof Permission, string | FindOperator<any>>>): Promise<Permission[]> {
    return this.repository.findBy({ ...(prop as FindOptionsWhere<Permission>) });
  }
  deleteById(permission: Permission): Promise<Permission> {
    return this.repository.remove(permission);
  }
}
