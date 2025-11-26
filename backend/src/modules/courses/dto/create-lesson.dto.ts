import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LessonType } from '../entities/lesson.entity';

export { LessonType };

export class CreateLessonDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @IsEnum(LessonType, {
    message: 'Type must be VIDEO, PDF, or BOTH',
  })
  @IsOptional()
  type?: LessonType;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0, { message: 'Order must be 0 or greater' })
  order?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0, { message: 'Duration must be 0 or greater' })
  duration?: number; // Duration in minutes

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isPreview?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}

