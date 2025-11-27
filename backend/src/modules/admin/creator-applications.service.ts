import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorApplication, ApplicationStatus } from './entities/creator-application.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';

@Injectable()
export class CreatorApplicationsService {
  constructor(
    @InjectRepository(CreatorApplication)
    private applicationRepository: Repository<CreatorApplication>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createApplication(
    userId: string,
    createApplicationDto: CreateApplicationDto,
  ): Promise<CreatorApplication> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a creator or admin
    if (user.role === UserRole.CREATOR || user.role === UserRole.ADMIN) {
      throw new BadRequestException('User is already a creator or admin');
    }

    // Check if user already has a pending application
    const existingApplication = await this.applicationRepository.findOne({
      where: { userId, status: ApplicationStatus.PENDING },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'You already have a pending application. Please wait for review.',
      );
    }

    // Create new application
    const application = this.applicationRepository.create({
      userId,
      motivation: createApplicationDto.motivation,
      experience: createApplicationDto.experience,
      documents: createApplicationDto.documents,
      status: ApplicationStatus.PENDING,
      submittedAt: new Date(),
    });

    return await this.applicationRepository.save(application);
  }

  async getMyApplication(userId: string): Promise<CreatorApplication | null> {
    return await this.applicationRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getAllApplications(
    requestingUserId: string,
  ): Promise<CreatorApplication[]> {
    // Verify requesting user is admin
    const admin = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view all applications');
    }

    return await this.applicationRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getApplicationById(
    id: string,
    requestingUserId: string,
  ): Promise<CreatorApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if user is admin or the application owner
    const user = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.ADMIN && application.userId !== requestingUserId) {
      throw new ForbiddenException(
        'You do not have permission to view this application',
      );
    }

    return application;
  }

  async reviewApplication(
    id: string,
    reviewDto: ReviewApplicationDto,
    reviewerId: string,
  ): Promise<CreatorApplication> {
    // Verify reviewer is admin
    const reviewer = await this.userRepository.findOne({
      where: { id: reviewerId },
    });

    if (!reviewer || reviewer.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can review applications');
    }

    // Find application
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if already reviewed
    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Application has already been reviewed',
      );
    }

    // Validate rejection reason if rejecting
    if (
      reviewDto.status === ApplicationStatus.REJECTED &&
      (!reviewDto.rejectionReason || reviewDto.rejectionReason.trim().length === 0)
    ) {
      throw new BadRequestException(
        'Rejection reason is required when rejecting an application',
      );
    }

    // Update application
    application.status = reviewDto.status;
    application.reviewedBy = reviewerId;
    application.reviewedAt = new Date();
    if (reviewDto.rejectionReason) {
      application.rejectionReason = reviewDto.rejectionReason;
    }

    // If approved, update user role to CREATOR
    if (reviewDto.status === ApplicationStatus.APPROVED) {
      const user = await this.userRepository.findOne({
        where: { id: application.userId },
      });
      if (user) {
        user.role = UserRole.CREATOR;
        await this.userRepository.save(user);
      }
    }

    return await this.applicationRepository.save(application);
  }

  async approveApplication(
    id: string,
    reviewerId: string,
  ): Promise<CreatorApplication> {
    return this.reviewApplication(
      id,
      { status: ApplicationStatus.APPROVED },
      reviewerId,
    );
  }

  async rejectApplication(
    id: string,
    rejectionReason: string,
    reviewerId: string,
  ): Promise<CreatorApplication> {
    return this.reviewApplication(
      id,
      {
        status: ApplicationStatus.REJECTED,
        rejectionReason,
      },
      reviewerId,
    );
  }
}

