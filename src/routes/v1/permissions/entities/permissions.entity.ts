import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolesPermission } from '../../role-permission/entities/roles-permissions.entity';
import { UserRolePermission } from '../../user-role-permission/entities/user-role.entity';
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'citext', unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RolesPermission, (rolePermission) => rolePermission.permission)
  rolePermission: RolesPermission[];

  @OneToMany(() => UserRolePermission, (userPermission) => userPermission.permission)
  userPermission: UserRolePermission[];
}
