import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class PaymentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  paymentId: string;

  @Column()
  eventType: string;

  @Column('decimal')
  amount: number;

  @Column()
  status: string;

  @Column({ default: 'pending' })
  processingStatus: 'pending' | 'processed' | 'failed';

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;
}
