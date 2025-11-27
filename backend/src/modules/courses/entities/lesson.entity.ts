import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Section } from './section.entity';

export enum LessonType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  BOTH = 'BOTH',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ nullable: false })
  courseId: string;

  @ManyToOne(() => Section, (section) => section.lessons, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column({ nullable: true })
  sectionId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.VIDEO,
  })
  type: LessonType;

  @Column({ nullable: true })
  videoUrl: string; // Video file URL or HLS manifest URL

  @Column({ nullable: true })
  pdfUrl: string; // PDF file URL

  @Column({ type: 'int', default: 0 })
  order: number; // Lesson order in course

  @Column({ type: 'int', nullable: true })
  duration: number; // Duration in minutes

  @Column({ default: false })
  isPreview: boolean; // Free preview lesson

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

