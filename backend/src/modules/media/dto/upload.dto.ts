import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MediaType } from '../entities/media.entity';

export class UploadMediaDto {
  @IsEnum(MediaType, {
    message: 'Type must be VIDEO, PDF, IMAGE, or AUDIO',
  })
  type: MediaType;

  @IsString()
  @IsOptional()
  description?: string;
}

