import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolesPermission } from '../../role-permission/entities/roles-permissions.entity';
import { UserRolePermission } from '../../user-role-permission/entities/user-role.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ type: 'citext', unique: true })
  @Field()
  name: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => RolesPermission)
  @OneToMany(() => RolesPermission, (rolePermission) => rolePermission.role)
  rolePermission: RolesPermission[];

  @Field((type) => UserRolePermission)
  @OneToMany(() => UserRolePermission, (userRole) => userRole.role)
  userRole: UserRolePermission[];
}
