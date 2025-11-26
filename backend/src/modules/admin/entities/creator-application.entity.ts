import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('creator_applications')
export class CreatorApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  motivation: string; // Why they want to be a creator

  @Column({ type: 'text', nullable: true })
  experience: string; // Their experience/background

  @Column({ type: 'jsonb', nullable: true })
  documents: {
    resume?: string; // URL to resume document
    portfolio?: string; // URL to portfolio
    certifications?: string[]; // Array of certification URLs
    other?: string[]; // Other supporting documents
  };

  @Column({ nullable: true })
  reviewedBy: string; // Admin user ID who reviewed

  @Column({ nullable: true })
  rejectionReason: string; // Reason for rejection if rejected

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

