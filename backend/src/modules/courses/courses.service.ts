import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course, CourseStatus } from './entities/course.entity';
import { Section } from './entities/section.entity';
import { Lesson } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { CreateCourseDto, CreateSectionDto, CreateLessonDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createCourseDto: CreateCourseDto, creatorId: string): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      creatorId,
      price: createCourseDto.price || 0,
      status: createCourseDto.status || CourseStatus.DRAFT,
    });

    const savedCourse = await this.courseRepository.save(course);

    // Create sections and lessons if provided
    if (createCourseDto.sections && createCourseDto.sections.length > 0) {
      for (const sectionDto of createCourseDto.sections) {
        const section = this.sectionRepository.create({
          ...sectionDto,
          courseId: savedCourse.id,
        });
        const savedSection = await this.sectionRepository.save(section);

        if (sectionDto.lessons && sectionDto.lessons.length > 0) {
          for (const lessonDto of sectionDto.lessons) {
            const lesson = this.lessonRepository.create({
              ...lessonDto,
              sectionId: savedSection.id,
            });
            await this.lessonRepository.save(lesson);
          }
        }
      }
    }

    return this.findOne(savedCourse.id);
  }

  async findAll(
    filters?: {
      status?: CourseStatus;
      category?: string;
      level?: string;
      creatorId?: string;
      search?: string;
    },
  ): Promise<Course[]> {
    const query = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course.sections', 'sections')
      .leftJoinAndSelect('sections.lessons', 'lessons')
      .orderBy('course.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('course.status = :status', { status: filters.status });
    }

    if (filters?.category) {
      query.andWhere('course.category = :category', { category: filters.category });
    }

    if (filters?.level) {
      query.andWhere('course.level = :level', { level: filters.level });
    }

    if (filters?.creatorId) {
      query.andWhere('course.creatorId = :creatorId', { creatorId: filters.creatorId });
    }

    if (filters?.search) {
      query.andWhere(
        '(course.title ILIKE :search OR course.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['creator', 'sections', 'sections.lessons'],
      order: {
        sections: { order: 'ASC' },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, userId: string): Promise<Course> {
    const course = await this.findOne(id);

    if (course.creatorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async remove(id: string, userId: string): Promise<void> {
    const course = await this.findOne(id);

    if (course.creatorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepository.remove(course);
  }

  async enroll(courseId: string, userId: string): Promise<Enrollment> {
    const course = await this.findOne(courseId);

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new BadRequestException('Course is not available for enrollment');
    }

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { courseId, userId },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    const enrollment = this.enrollmentRepository.create({
      courseId,
      userId,
      progress: 0,
      completed: false,
    });

    // Update course enrollment count
    course.totalEnrollments += 1;
    await this.courseRepository.save(course);

    return this.enrollmentRepository.save(enrollment);
  }

  async updateProgress(
    courseId: string,
    userId: string,
    updateProgressDto: UpdateProgressDto,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { courseId, userId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (updateProgressDto.progress !== undefined) {
      enrollment.progress = updateProgressDto.progress;
    }

    if (updateProgressDto.completed !== undefined) {
      enrollment.completed = updateProgressDto.completed;
      if (updateProgressDto.completed) {
        enrollment.completedAt = new Date();
      }
    }

    return this.enrollmentRepository.save(enrollment);
  }

  async getEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { userId },
      relations: ['course', 'course.creator'],
      order: { enrolledAt: 'DESC' },
    });
  }

  async getMyCourses(creatorId: string): Promise<Course[]> {
    return this.findAll({ creatorId });
  }

  async incrementViews(courseId: string): Promise<void> {
    const course = await this.findOne(courseId);
    course.totalViews += 1;
    await this.courseRepository.save(course);
  }
}

