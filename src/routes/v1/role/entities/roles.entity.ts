import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolesPermission } from '../../role-permission/entities/roles-permissions.entity';
import { UserRolePermission } from '../../user-role-permission/entities/user-role.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'citext', unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RolesPermission, (rolePermission) => rolePermission.role)
  rolePermission: RolesPermission[];

  @OneToMany(() => UserRolePermission, (userRole) => userRole.role)
  userRole: UserRolePermission[];
}
