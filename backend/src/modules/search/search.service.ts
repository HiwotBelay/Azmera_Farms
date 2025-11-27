import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Course, CourseStatus } from '../courses/entities/course.entity';
import { Category } from '../courses/entities/category.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async searchCourses(query: string, filters?: {
    categoryId?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    isFree?: boolean;
    language?: string;
  }) {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED });

    // Search in title, description, and tags
    if (query) {
      queryBuilder.andWhere(
        '(course.title ILIKE :query OR course.description ILIKE :query OR course.shortDescription ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    // Apply filters
    if (filters?.categoryId) {
      queryBuilder.andWhere('course.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters?.level) {
      queryBuilder.andWhere('course.level = :level', { level: filters.level });
    }

    if (filters?.language) {
      queryBuilder.andWhere('course.language = :language', {
        language: filters.language,
      });
    }

    if (filters?.isFree !== undefined) {
      queryBuilder.andWhere('course.isFree = :isFree', {
        isFree: filters.isFree,
      });
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        queryBuilder.andWhere('course.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });
      } else if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('course.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      } else if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('course.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }
    }

    const courses = await queryBuilder
      .orderBy('course.rating', 'DESC')
      .addOrderBy('course.studentsCount', 'DESC')
      .take(50)
      .getMany();

    return courses;
  }

  async getRecommendations(userId: string, limit = 10) {
    // Get user's enrolled courses
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['enrollments', 'enrollments.course'],
    });

    if (!user) {
      return [];
    }

    const enrolledCategoryIds = user.enrollments
      ?.map((e) => e.course?.categoryId)
      .filter((id) => id) || [];

    // Recommend courses in similar categories
    const recommendations = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .andWhere('course.id NOT IN (:...enrolledIds)', {
        enrolledIds: user.enrollments?.map((e) => e.courseId) || [],
      })
      .andWhere(enrolledCategoryIds.length > 0 ? 'course.categoryId IN (:...categoryIds)' : '1=1', {
        categoryIds: enrolledCategoryIds,
      })
      .orderBy('course.rating', 'DESC')
      .addOrderBy('course.studentsCount', 'DESC')
      .take(limit)
      .getMany();

    return recommendations;
  }

  async getPopularCourses(limit = 10) {
    return await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('course.studentsCount', 'DESC')
      .addOrderBy('course.rating', 'DESC')
      .take(limit)
      .getMany();
  }

  async getTrendingCourses(limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoin('course.enrollments', 'enrollment')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .andWhere('enrollment.enrolledAt >= :date', { date: thirtyDaysAgo })
      .groupBy('course.id')
      .addGroupBy('creator.id')
      .addGroupBy('category.id')
      .orderBy('COUNT(enrollment.id)', 'DESC')
      .take(limit)
      .getMany();
  }
}

