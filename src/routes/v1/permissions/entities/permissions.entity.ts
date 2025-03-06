import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolesPermission } from '../../role-permission/entities/roles-permissions.entity';
import { UserRolePermission } from '../../user-role-permission/entities/user-role.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ type: 'citext', unique: true })
  @Field()
  name: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Field((type) => RolesPermission)
  @OneToMany(() => RolesPermission, (rolePermission) => rolePermission.permission)
  rolePermission: RolesPermission[];

  @Field((type) => UserRolePermission)
  @OneToMany(() => UserRolePermission, (userPermission) => userPermission.permission)
  userPermission: UserRolePermission[];
}
