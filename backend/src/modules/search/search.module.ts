import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Course } from '../courses/entities/course.entity';
import { Category } from '../courses/entities/category.entity';
import { User } from '../auth/entities/user.entity';
import { Enrollment } from '../courses/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Category, User, Enrollment]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}

