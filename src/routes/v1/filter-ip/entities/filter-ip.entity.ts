import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('filter_ip')
@Unique(['address'])
export class FilterIP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  address: string;

  @Column({ default: true })
  isBlocked: boolean;

  @Column({ default: false })
  permanentlyBlocked: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  blockedUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
