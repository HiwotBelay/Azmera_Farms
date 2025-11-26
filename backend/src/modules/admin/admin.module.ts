import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorApplicationsController } from './creator-applications.controller';
import { CreatorApplicationsService } from './creator-applications.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CoursesModule } from '../courses/courses.module';
import { CreatorApplication } from './entities/creator-application.entity';
import { User } from '../auth/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../courses/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorApplication,
      User,
      Course,
      Enrollment,
    ]),
    forwardRef(() => CoursesModule),
  ],
  controllers: [CreatorApplicationsController, AdminController],
  providers: [CreatorApplicationsService, AdminService],
  exports: [CreatorApplicationsService, AdminService],
})
export class AdminModule {}

