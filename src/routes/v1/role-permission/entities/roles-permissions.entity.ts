import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../role/entities/roles.entity';
import { Permission } from '../../permissions/entities/permissions.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('role_permissions')
export class RolesPermission {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field((type) => Int)
  roleId: number;

  @Column()
  @Field((type) => Int)
  permissionId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => Role)
  @ManyToOne(() => Role, (role) => role.rolePermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  permission: Permission;
}
