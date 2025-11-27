import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    courseId: string,
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is enrolled (for verified reviews)
    const enrollment = await this.enrollmentRepository.findOne({
      where: { courseId, userId },
    });

    // Check if user already reviewed
    const existingReview = await this.reviewRepository.findOne({
      where: { courseId, userId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this course');
    }

    const review = this.reviewRepository.create({
      courseId,
      userId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      isVerified: !!enrollment,
      isModerated: false,
      isVisible: true,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update course rating
    await this.updateCourseRating(courseId);

    return savedReview;
  }

  async findAll(courseId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { courseId, isVisible: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    updateDto: Partial<CreateReviewDto>,
    userId: string,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id, userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    Object.assign(review, updateDto);
    const savedReview = await this.reviewRepository.save(review);

    // Update course rating
    await this.updateCourseRating(review.courseId);

    return savedReview;
  }

  async delete(id: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id, userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const courseId = review.courseId;
    await this.reviewRepository.remove(review);

    // Update course rating
    await this.updateCourseRating(courseId);
  }

  async moderate(id: string, isVisible: boolean): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.isVisible = isVisible;
    review.isModerated = true;

    const savedReview = await this.reviewRepository.save(review);

    // Update course rating
    await this.updateCourseRating(review.courseId);

    return savedReview;
  }

  private async updateCourseRating(courseId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { courseId, isVisible: true },
    });

    if (reviews.length === 0) {
      await this.courseRepository.update(courseId, {
        rating: 0,
        reviewsCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await this.courseRepository.update(courseId, {
      rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      reviewsCount: reviews.length,
    });
  }
}

