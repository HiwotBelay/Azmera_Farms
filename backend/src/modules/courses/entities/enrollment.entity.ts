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
import { Course } from './course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number; // Completion percentage (0-100)

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ type: 'int', default: 0 })
  lastLessonOrder: number; // Last accessed lesson order

  @CreateDateColumn()
  enrolledAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

