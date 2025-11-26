import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { CourseLevel } from '../entities/course.entity';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(50, { message: 'Description must be at least 50 characters long' })
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Short description must not exceed 500 characters' })
  shortDescription?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsEnum(CourseLevel, {
    message: 'Level must be BEGINNER, INTERMEDIATE, or ADVANCED',
  })
  @IsOptional()
  level?: CourseLevel;

  @IsNumber()
  @Min(0, { message: 'Price must be 0 or greater' })
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  language?: string;
}

