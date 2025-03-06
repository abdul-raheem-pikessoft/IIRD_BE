import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { LanguageEnum } from '../../../../enums/language.enum';
import { File } from '../../files/entities/file.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { UserRolePermission } from '../../user-role-permission/entities/user-role.entity';
import { UserToken } from '../../user-tokens/entities/user-tokens.entity';

@Entity('users')
@Unique(['email'])
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Column({ default: false })
  isTwoFactorAuth: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Exclude()
  salt: string;

  @Column({ default: false })
  @Field({ defaultValue: false })
  isActive: boolean;

  @Exclude()
  @Field({ nullable: true })
  @Column({ nullable: true })
  googleSocialId: string;

  @Exclude()
  @Field({ nullable: true })
  @Column({ nullable: true })
  facebookSocialId: string;

  @Column({
    type: 'enum',
    enum: LanguageEnum,
    default: LanguageEnum.EN,
  })
  languagePreference: LanguageEnum;

  @Field((type) => [UserToken])
  @OneToMany(() => UserToken, (token) => token.user)
  token: UserToken[];

  @Field((type) => [UserRolePermission], { nullable: 'items' })
  @OneToMany(() => UserRolePermission, (userRolePermission) => userRolePermission.user)
  userRolePermission: UserRolePermission[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    onDelete: 'SET NULL',
  })
  notification: Notification[];

  @OneToMany(() => File, (file) => file.user, { onDelete: 'SET NULL' })
  user_files: File[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
