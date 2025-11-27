import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from './category.entity';
import { Lesson } from './lesson.entity';
import { Enrollment } from './enrollment.entity';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: false })
  isFree: boolean;

  @Column({ nullable: true })
  thumbnail: string; // Thumbnail image URL

  @Column({ type: 'jsonb', nullable: true })
  images: string[]; // Array of image URLs

  @Column({ default: 0 })
  duration: number; // Total duration in minutes

  @Column({ default: 0 })
  lessonsCount: number;

  @Column({ default: 0 })
  studentsCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // Average rating

  @Column({ default: 0 })
  reviewsCount: number;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[]; // Array of tags

  @Column({ type: 'text', nullable: true })
  language: string; // 'en' or 'am'

  @Column({ nullable: true })
  rejectionReason: string; // If rejected by admin

  @Column({ nullable: true })
  reviewedBy: string; // Admin user ID who reviewed

  @Column({ nullable: true })
  reviewedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
  lessons: Lesson[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  // Sections relationship (using string reference to avoid circular dependency)
  @OneToMany('Section', 'course')
  sections?: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

