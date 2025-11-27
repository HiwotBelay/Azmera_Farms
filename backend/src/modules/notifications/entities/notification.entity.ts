import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum NotificationType {
  COURSE_ENROLLMENT = 'COURSE_ENROLLMENT',
  COURSE_COMPLETION = 'COURSE_COMPLETION',
  COURSE_APPROVED = 'COURSE_APPROVED',
  COURSE_REJECTED = 'COURSE_REJECTED',
  CREATOR_APPLICATION_APPROVED = 'CREATOR_APPLICATION_APPROVED',
  CREATOR_APPLICATION_REJECTED = 'CREATOR_APPLICATION_REJECTED',
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  NEW_COURSE_AVAILABLE = 'NEW_COURSE_AVAILABLE',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  SYSTEM = 'SYSTEM',
}

@Entity('notifications')
@Index(['userId', 'read'])
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>; // Additional data (courseId, etc.)

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ default: false })
  emailSent: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

