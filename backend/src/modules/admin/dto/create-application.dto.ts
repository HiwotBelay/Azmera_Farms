import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MinLength(50, { message: 'Motivation must be at least 50 characters long' })
  @MaxLength(2000, {
    message: 'Motivation must not exceed 2000 characters',
  })
  motivation: string;

  @IsString()
  @IsOptional()
  @MinLength(50, {
    message: 'Experience must be at least 50 characters long',
  })
  @MaxLength(2000, {
    message: 'Experience must not exceed 2000 characters',
  })
  experience?: string;

  @IsObject()
  @IsOptional()
  documents?: {
    resume?: string;
    portfolio?: string;
    certifications?: string[];
    other?: string[];
  };
}

