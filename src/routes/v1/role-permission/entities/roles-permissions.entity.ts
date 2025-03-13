import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../role/entities/roles.entity';
import { Permission } from '../../permissions/entities/permissions.entity';

@Entity('role_permissions')
export class RolesPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  permissionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.rolePermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  permission: Permission;
}
