import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  originalName: string;

  @Column({ nullable: true })
  mimetype: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'jsonb', default: [] })
  versions: string[];

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.user_files, {
    onDelete: 'CASCADE',
  })
  user: User;
}
