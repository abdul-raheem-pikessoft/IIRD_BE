import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { LanguageEnum } from '../../../../enums/language.enum';
import { File } from '../../files/entities/file.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { UserRolePermission } from '../../user-role-permission/entities/user-role.entity';
import { UserToken } from '../../user-tokens/entities/user-tokens.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: false })
  isTwoFactorAuth: boolean;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  salt: string;

  @Column({ default: false })
  isActive: boolean;

  @Exclude()
  @Column({ nullable: true })
  googleSocialId: string;

  @Exclude()
  @Column({ nullable: true })
  facebookSocialId: string;

  @Column({
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.EN,
  })
  languagePreference: LanguageEnum;

  @OneToMany(() => UserToken, (token) => token.user)
  token: UserToken[];

  @OneToMany(() => UserRolePermission, (userRolePermission) => userRolePermission.user)
  userRolePermission: UserRolePermission[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    onDelete: 'SET NULL',
  })
  notification: Notification[];

  @OneToMany(() => File, (file) => file.user, { onDelete: 'SET NULL' })
  user_files: File[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
