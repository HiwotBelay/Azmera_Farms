import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../entities/creator-application.entity';

export class ReviewApplicationDto {
  @IsEnum(ApplicationStatus, {
    message: 'Status must be either APPROVED or REJECTED',
  })
  status: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED;

  @IsString()
  @IsOptional()
  rejectionReason?: string; // Required if status is REJECTED
}

