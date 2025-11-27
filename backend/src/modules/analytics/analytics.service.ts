import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Course, CourseStatus } from '../courses/entities/course.entity';
import { Enrollment } from '../courses/entities/enrollment.entity';
import { User } from '../auth/entities/user.entity';
import { Review } from '../courses/entities/review.entity';
import { QuizAttempt } from '../courses/entities/quiz-attempt.entity';
import { LessonProgress } from '../courses/entities/lesson-progress.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(QuizAttempt)
    private quizAttemptRepository: Repository<QuizAttempt>,
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async getPlatformStats() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      publishedCourses,
      activeUsers,
    ] = await Promise.all([
      this.userRepository.count(),
      this.courseRepository.count(),
      this.enrollmentRepository.count(),
      this.courseRepository
        .createQueryBuilder('course')
        .select('SUM(course.price)', 'total')
        .where('course.status = :status', { status: CourseStatus.PUBLISHED })
        .getRawOne(),
      this.courseRepository.count({ where: { status: CourseStatus.PUBLISHED } }),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.lastLoginAt > :date', {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        })
        .getCount(),
    ]);

    return {
      totalUsers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      activeUsers,
    };
  }

  async getCourseAnalytics(courseId: string, creatorId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course || course.creatorId !== creatorId) {
      throw new Error('Course not found or unauthorized');
    }

    const [
      enrollments,
      reviews,
      completions,
      averageRating,
      revenue,
    ] = await Promise.all([
      this.enrollmentRepository.count({ where: { courseId } }),
      this.reviewRepository.count({ where: { courseId } }),
      this.enrollmentRepository.count({
        where: { courseId, isCompleted: true },
      }),
      this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'avg')
        .where('review.courseId = :courseId', { courseId })
        .getRawOne(),
      this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .leftJoin('enrollment.course', 'course')
        .select('SUM(course.price)', 'total')
        .where('enrollment.courseId = :courseId', { courseId })
        .getRawOne(),
    ]);

    return {
      courseId,
      enrollments,
      reviews,
      completions,
      completionRate: enrollments > 0 ? (completions / enrollments) * 100 : 0,
      averageRating: parseFloat(averageRating?.avg || '0'),
      revenue: parseFloat(revenue?.total || '0'),
    };
  }

  async getUserAnalytics(userId: string) {
    const [
      enrolledCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent,
      certificates,
    ] = await Promise.all([
      this.enrollmentRepository.count({ where: { userId } }),
      this.enrollmentRepository.count({
        where: { userId, isCompleted: true },
      }),
      this.enrollmentRepository.count({
        where: { userId, isCompleted: false },
      }),
      this.lessonProgressRepository
        .createQueryBuilder('progress')
        .leftJoin('progress.lesson', 'lesson')
        .select('SUM(lesson.duration)', 'total')
        .where('progress.userId = :userId', { userId })
        .getRawOne(),
      this.enrollmentRepository.count({
        where: { userId, isCompleted: true },
      }), // Assuming certificate = completed course
    ]);

    return {
      enrolledCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent: parseFloat(totalTimeSpent?.total || '0'),
      certificates,
    };
  }

  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const query = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoin('enrollment.course', 'course')
      .select('SUM(course.price)', 'total')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED });

    if (startDate && endDate) {
      query.andWhere('enrollment.enrolledAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();

    return {
      totalRevenue: parseFloat(result?.total || '0'),
      period: { startDate, endDate },
    };
  }
}

