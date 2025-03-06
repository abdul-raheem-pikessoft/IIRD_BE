import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from './entities/roles.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async create(name: string) {
    return this.repository.create({ name });
  }

  async save(role: Role) {
    return this.repository.save(role);
  }

  async findAll() {
    return this.repository.find({
      relations: ['rolePermission', 'rolePermission.permission'],
    });
  }

  async findOneByProps(props: Partial<Role>) {
    return this.repository.findOne({
      where: { ...(props as FindOptionsWhere<typeof props>) },
      relations: ['rolePermission', 'rolePermission.permission'],
    });
  }

  async deleteById(role: Role) {
    return this.repository.remove(role);
  }
}
