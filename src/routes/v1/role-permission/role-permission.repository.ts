import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, In, DeleteResult } from 'typeorm';
import { RolesPermission } from './entities/roles-permissions.entity';

@Injectable()
export class RolePermissionRepository {
  constructor(
    @InjectRepository(RolesPermission)
    private readonly repository: Repository<RolesPermission>,
  ) {}

  create(data: Partial<RolesPermission>): RolesPermission {
    return this.repository.create(data);
  }

  save(data: Partial<RolesPermission>): Promise<RolesPermission> {
    return this.repository.save(data);
  }

  delete(permissions: number[], roleId: number): Promise<DeleteResult> {
    return this.repository.delete({ roleId: roleId, permissionId: In(permissions) });
  }

  findAll(): Promise<RolesPermission[]> {
    return this.repository.find();
  }

  findOneByProps(props: Partial<RolesPermission>): Promise<RolesPermission> {
    return this.repository.findOneBy({ ...(props as FindOptionsWhere<typeof props>) });
  }

  getPermissionsOfRole(roleId: number): Promise<RolesPermission[]> {
    return this.repository.find({
      where: { roleId },
      relations: ['permission'],
    });
  }

  getRolesOfPermission(permissionId: number): Promise<RolesPermission[]> {
    return this.repository.find({
      where: { permissionId },
      relations: ['role'],
    });
  }
}
