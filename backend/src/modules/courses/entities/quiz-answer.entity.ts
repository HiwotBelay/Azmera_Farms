import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { QuizAttempt } from './quiz-attempt.entity';
import { QuizQuestion } from './quiz-question.entity';

@Entity('quiz_answers')
export class QuizAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QuizAttempt, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attemptId' })
  attempt: QuizAttempt;

  @Column()
  attemptId: string;

  @ManyToOne(() => QuizQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: QuizQuestion;

  @Column()
  questionId: string;

  @Column({ type: 'jsonb' })
  answers: string[]; // User's answers

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  points: number; // Points earned for this answer

  @CreateDateColumn()
  createdAt: Date;
}

