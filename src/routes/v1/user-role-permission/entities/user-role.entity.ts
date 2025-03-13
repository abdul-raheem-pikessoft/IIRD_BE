import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../role/entities/roles.entity';
import { Permission } from '../../permissions/entities/permissions.entity';

@Entity('user_role_permissions')
export class UserRolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  roleId: number;

  @Column({ nullable: true })
  permissionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userRolePermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRole, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.userPermission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  permission: Permission;
}
