import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Lesson } from './lesson.entity';

@Entity('lesson_progress')
@Unique(['userId', 'lessonId'])
export class LessonProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column()
  lessonId: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ type: 'int', default: 0 })
  watchedDuration: number; // Duration watched in seconds

  @Column({ type: 'int', nullable: true })
  lastPosition: number; // Last watched position in seconds

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

