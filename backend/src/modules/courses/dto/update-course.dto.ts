import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { CourseStatus } from '../entities/course.entity';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}

