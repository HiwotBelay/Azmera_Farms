import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { ProgressController } from './progress.controller';
import { CategoriesController } from './categories.controller';
import { QuizzesController } from './quizzes.controller';
import { ReviewsController } from './reviews.controller';
import { CoursesService } from './courses.service';
import { ProgressService } from './progress.service';
import { CategoriesService } from './categories.service';
import { QuizzesService } from './quizzes.service';
import { ReviewsService } from './reviews.service';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Category } from './entities/category.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { Review } from './entities/review.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Lesson,
      Enrollment,
      Category,
      LessonProgress,
      Quiz,
      QuizQuestion,
      QuizAttempt,
      QuizAnswer,
      Review,
      User,
    ]),
  ],
  controllers: [CoursesController, ProgressController, CategoriesController, QuizzesController, ReviewsController],
  providers: [CoursesService, ProgressService, CategoriesService, QuizzesService, ReviewsService],
  exports: [CoursesService, ProgressService, CategoriesService, QuizzesService, ReviewsService],
})
export class CoursesModule {}

