import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../role/entities/roles.entity';
import { Permission } from '../../permissions/entities/permissions.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('user_role_permissions')
export class UserRolePermission {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field((type) => Int)
  userId: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  roleId: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  permissionId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.userRolePermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @Field((type) => Role, { nullable: true })
  @ManyToOne(() => Role, (role) => role.userRole, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  role: Role;

  @Field((type) => Permission, { nullable: true })
  @ManyToOne(() => Permission, (permission) => permission.userPermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  permission: Permission;
}
