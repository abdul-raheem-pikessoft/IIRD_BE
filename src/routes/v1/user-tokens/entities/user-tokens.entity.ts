import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserTokenTypeEnum } from '../../../../enums/user.enum';

@ObjectType()
@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  @Field()
  token: string;

  @Column({ nullable: true })
  @Field()
  otp: string;

  @Field()
  @Column({
    type: 'enum',
    enum: UserTokenTypeEnum,
  })
  type: UserTokenTypeEnum;

  @Field()
  @Column({ nullable: true })
  key: string;

  @Field()
  @Column({ nullable: true })
  blockedUntil: Date;

  @Field()
  @Column({ nullable: true })
  uuid: string;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.token)
  user: User;

  @Column({ nullable: true })
  @Field()
  expiresAt: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn()
  @Field()
  deletedAt: Date;

  @Column()
  @Field()
  userId: number;
}
