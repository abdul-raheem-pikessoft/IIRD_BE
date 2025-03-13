import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserTokenTypeEnum } from '../../../../enums/user.enum';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  otp: string;

  @Column({
    type: 'enum',
    enum: UserTokenTypeEnum,
  })
  type: UserTokenTypeEnum;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  blockedUntil: Date;

  @Column({ nullable: true })
  uuid: string;

  @ManyToOne(() => User, (user) => user.token)
  user: User;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  userId: number;
}
