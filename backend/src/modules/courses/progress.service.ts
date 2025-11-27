import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Lesson } from './entities/lesson.entity';
import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async markLessonComplete(
    courseId: string,
    lessonId: string,
    userId: string,
  ): Promise<LessonProgress> {
    // Verify course exists
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Verify lesson exists and belongs to course
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, courseId },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Verify user is enrolled
    const enrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course');
    }

    // Get or create lesson progress
    let progress = await this.lessonProgressRepository.findOne({
      where: { userId, lessonId },
    });

    if (!progress) {
      progress = this.lessonProgressRepository.create({
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
        watchedDuration: lesson.duration ? lesson.duration * 60 : 0, // Convert minutes to seconds
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    const savedProgress = await this.lessonProgressRepository.save(progress);

    // Update course progress
    await this.updateCourseProgress(courseId, userId);

    return savedProgress;
  }

  async updateLessonProgress(
    courseId: string,
    lessonId: string,
    userId: string,
    watchedDuration: number,
    lastPosition?: number,
  ): Promise<LessonProgress> {
    // Verify enrollment
    const enrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course');
    }

    // Get or create lesson progress
    let progress = await this.lessonProgressRepository.findOne({
      where: { userId, lessonId },
    });

    if (!progress) {
      progress = this.lessonProgressRepository.create({
        userId,
        lessonId,
        watchedDuration,
        lastPosition,
      });
    } else {
      progress.watchedDuration = watchedDuration;
      if (lastPosition !== undefined) {
        progress.lastPosition = lastPosition;
      }
    }

    return await this.lessonProgressRepository.save(progress);
  }

  async getCourseProgress(
    courseId: string,
    userId: string,
  ): Promise<{
    course: Course;
    enrollment: Enrollment;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lessonProgress: LessonProgress[];
  }> {
    // Verify course exists
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['lessons'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Verify enrollment
    const enrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course');
    }

    // Get all lesson progress for this course
    const lessons = await this.lessonRepository.find({
      where: { courseId, isActive: true },
    });

    const lessonProgress = await this.lessonProgressRepository.find({
      where: {
        userId,
        lessonId: In(lessons.map((l) => l.id)),
      },
    });

    const completedLessons = lessonProgress.filter((p) => p.isCompleted).length;
    const totalLessons = lessons.length;
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Update enrollment progress
    enrollment.progress = progress;
    enrollment.isCompleted = progress === 100;
    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }
    await this.enrollmentRepository.save(enrollment);

    return {
      course,
      enrollment,
      progress,
      completedLessons,
      totalLessons,
      lessonProgress,
    };
  }

  async getAllUserProgress(userId: string): Promise<{
    enrollments: Enrollment[];
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
  }> {
    const enrollments = await this.enrollmentRepository.find({
      where: { userId },
      relations: ['course', 'course.category'],
      order: { enrolledAt: 'DESC' },
    });

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.isCompleted).length;
    const inProgressCourses = totalCourses - completedCourses;

    return {
      enrollments,
      totalCourses,
      completedCourses,
      inProgressCourses,
    };
  }

  private async updateCourseProgress(
    courseId: string,
    userId: string,
  ): Promise<void> {
    const lessons = await this.lessonRepository.find({
      where: { courseId, isActive: true },
    });

    const lessonProgress = await this.lessonProgressRepository.find({
      where: {
        userId,
        lessonId: In(lessons.map((l) => l.id)),
      },
    });

    const completedLessons = lessonProgress.filter((p) => p.isCompleted).length;
    const totalLessons = lessons.length;
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    const enrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });

    if (enrollment) {
      enrollment.progress = progress;
      enrollment.isCompleted = progress === 100;
      if (progress === 100 && !enrollment.completedAt) {
        enrollment.completedAt = new Date();
      }
      await this.enrollmentRepository.save(enrollment);
    }
  }
}

