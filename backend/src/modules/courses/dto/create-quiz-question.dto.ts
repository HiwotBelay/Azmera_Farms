import { IsString, IsEnum, IsArray, IsNumber, IsOptional } from 'class-validator';
import { QuestionType } from '../entities/quiz-question.entity';

export class CreateQuizQuestionDto {
  @IsString()
  question: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsArray()
  @IsString({ each: true })
  correctAnswers: string[];

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  explanation?: string;
}

