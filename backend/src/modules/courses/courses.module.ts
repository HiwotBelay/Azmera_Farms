import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { ProgressController } from './progress.controller';
import { CoursesService } from './courses.service';
import { ProgressService } from './progress.service';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Category } from './entities/category.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Lesson,
      Enrollment,
      Category,
      LessonProgress,
      User,
    ]),
  ],
  controllers: [CoursesController, ProgressController],
  providers: [CoursesService, ProgressService],
  exports: [CoursesService, ProgressService],
})
export class CoursesModule {}

