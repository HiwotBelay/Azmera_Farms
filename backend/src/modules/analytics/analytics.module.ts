import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../courses/entities/enrollment.entity';
import { User } from '../auth/entities/user.entity';
import { Review } from '../courses/entities/review.entity';
import { QuizAttempt } from '../courses/entities/quiz-attempt.entity';
import { LessonProgress } from '../courses/entities/lesson-progress.entity';
import { Lesson } from '../courses/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Enrollment,
      User,
      Review,
      QuizAttempt,
      LessonProgress,
      Lesson,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

