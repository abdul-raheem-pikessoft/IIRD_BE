import { Injectable } from '@nestjs/common';
import { UserRolePermission } from './entities/user-role.entity';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PrimitiveType } from '../../../types/global.types';
import { UserSpecificPermissionDto } from './dto/user-specific.permission.dto';

@Injectable()
export class UserRolePermissionRepository {
  constructor(
    @InjectRepository(UserRolePermission)
    private readonly repository: Repository<UserRolePermission>,
  ) {}

  create(data: Partial<UserRolePermission>): UserRolePermission {
    return this.repository.create(data);
  }

  save(data: Partial<UserRolePermission>): Promise<UserRolePermission> {
    return this.repository.save(data);
  }

  deleteRoleOrPermissions(data: Partial<UserRolePermission>): Promise<DeleteResult> {
    return this.repository.delete(data as FindOptionsWhere<typeof data>);
  }

  findAll(): Promise<UserRolePermission[]> {
    return this.repository.find();
  }

  findById(id: number): Promise<UserRolePermission> {
    return this.repository.findOne({ where: { id } });
  }

  findByUserId(id: number): Promise<UserRolePermission[]> {
    return this.repository.find({ where: { userId: id } });
  }

  findByProps(props: Partial<UserRolePermission>): Promise<UserRolePermission> {
    return this.repository.findOne({
      where: { ...(props as FindOptionsWhere<PrimitiveType<UserRolePermission>>) },
    });
  }

  getRolesOfUser(userId: number): Promise<UserRolePermission[]> {
    return this.repository.find({
      where: { userId: userId },
      relations: ['role'],
    });
  }

  async getPermissionsOfUser(userId: number): Promise<UserRolePermission[]> {
    return await this.repository.find({
      where: { userId: userId },
      relations: ['permission'],
    });
  }

  findUserRolePermissionByUserAndPermissionId(props: UserSpecificPermissionDto): Promise<UserRolePermission | undefined> {
    return this.repository
      .createQueryBuilder('user_role_permissions')
      .leftJoinAndSelect('user_role_permissions.role', 'r')
      .leftJoinAndSelect('r.rolePermission', 'rp')
      .where('user_role_permissions.userId = :userId', { userId: props?.userId })
      .andWhere('(user_role_permissions.permissionId = :permissionId OR rp.permissionId = :permissionId)', {
        permissionId: props?.permissionId,
      })
      .getOne();
  }
}
