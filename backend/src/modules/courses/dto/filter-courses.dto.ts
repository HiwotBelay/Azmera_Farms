import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { CourseStatus, CourseLevel } from '../entities/course.entity';

export class FilterCoursesDto {
  @IsString()
  @IsOptional()
  search?: string; // Search in title/description

  @IsString()
  @IsOptional()
  categoryId?: string;

  @Transform(({ value }) => {
    // Accept both string and enum, normalize to uppercase string
    if (typeof value === 'string') {
      const upper = value.toUpperCase();
      // Validate it's a valid status
      if (['DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED'].includes(upper)) {
        return upper as CourseStatus;
      }
      return upper;
    }
    return value;
  })
  @IsOptional()
  @IsString()
  status?: CourseStatus | string;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @IsOptional()
  isFree?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sortBy?: 'createdAt' | 'price' | 'rating' | 'studentsCount';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

