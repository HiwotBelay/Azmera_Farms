import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Course, CourseStatus, CourseLevel } from './entities/course.entity';
import { Lesson, LessonType } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Category } from './entities/category.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCoursesDto } from './dto/filter-courses.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCourseDto: CreateCourseDto, creatorId: string): Promise<Course> {
    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
    
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    if (creator.role !== UserRole.CREATOR && creator.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only creators can create courses');
    }

    const course = this.courseRepository.create({
      ...createCourseDto,
      creatorId,
      status: CourseStatus.DRAFT,
      isFree: createCourseDto.isFree ?? (createCourseDto.price === 0 || !createCourseDto.price),
      price: createCourseDto.price ?? 0,
      level: createCourseDto.level ?? CourseLevel.BEGINNER,
    });

    return await this.courseRepository.save(course);
  }

  async findAll(filterDto: FilterCoursesDto, userId?: string): Promise<{ courses: Course[]; total: number }> {
    const page = filterDto.page ?? 0;
    const limit = filterDto.limit ?? 20;
    const skip = page * limit;

    // Log the incoming filter
    console.log('🔍 findAll called with filterDto:', JSON.stringify(filterDto));
    console.log('🔍 Status filter:', filterDto.status, 'Type:', typeof filterDto.status);

    // CRITICAL: Check for PENDING status FIRST - before any other logic
    // Use the EXACT same method as admin stats which works correctly
    // Be VERY aggressive in detecting PENDING status
    const statusStr = filterDto.status?.toString().toUpperCase().trim();
    const rawStatus = filterDto.status?.toString() || '';
    const statusAnyCase = filterDto.status?.toString() || '';
    
    // Check in multiple ways to ensure we catch it
    const isPendingRequest = 
      statusStr === 'PENDING' || 
      filterDto.status === CourseStatus.PENDING ||
      filterDto.status === 'PENDING' ||
      rawStatus.toUpperCase() === 'PENDING' ||
      statusAnyCase.toUpperCase().includes('PENDING') ||
      JSON.stringify(filterDto).toUpperCase().includes('PENDING');
    
    console.log('🔍 Status check (AGGRESSIVE):', {
      filterDtoStatus: filterDto.status,
      statusStr,
      rawStatus,
      statusAnyCase,
      isPendingRequest,
      statusType: typeof filterDto.status,
      filterDtoString: JSON.stringify(filterDto)
    });
    
    // ALWAYS run PENDING query if detected - no exceptions
    if (isPendingRequest) {
      console.log('🔍 PENDING status detected - using EXACT same query as admin stats');
      console.log('🔍 Status value:', filterDto.status, 'Normalized:', statusStr);
      
      // Use the EXACT same query method as admin stats (which works correctly)
      // This is the same query: this.courseRepository.count({ where: { status: CourseStatus.PENDING } })
      try {
        // Method 1: Use EXACT same TypeORM query as admin stats
        const directTotal = await this.courseRepository.count({
          where: { status: CourseStatus.PENDING },
        });
        
        console.log('📊 Direct count (same as admin stats):', directTotal);
        
        if (directTotal > 0) {
          const directCourses = await this.courseRepository.find({
            where: { status: CourseStatus.PENDING },
            relations: ['creator', 'category', 'lessons'],
            order: { createdAt: 'DESC' },
            skip: skip,
            take: limit,
          });
          
          console.log('✅ PENDING query result (TypeORM - same as admin stats):', {
            found: directCourses.length,
            total: directTotal,
            courses: directCourses.map(c => ({ 
              id: c.id, 
              title: c.title, 
              status: c.status,
              lessonsCount: c.lessons?.length || 0
            }))
          });
          
          return { courses: directCourses, total: directTotal };
        } else {
          console.log('⚠️ Count returned 0, but admin stats shows 2. Checking database directly...');
        }
        
        // If TypeORM returned 0, try raw SQL as absolute fallback
        console.log('⚠️ TypeORM returned 0, trying raw SQL query...');
        const rawQuery = `
          SELECT c.*, 
                 u.id as creator_id, u.email as creator_email, u."firstName" as creator_firstName, u."lastName" as creator_lastName,
                 cat.id as category_id, cat.name as category_name
          FROM courses c
          LEFT JOIN users u ON c."creatorId" = u.id
          LEFT JOIN categories cat ON c."categoryId" = cat.id
          WHERE c.status = 'PENDING'
          ORDER BY c."createdAt" DESC
          LIMIT $1 OFFSET $2
        `;
        const rawCountQuery = `SELECT COUNT(*) as count FROM courses WHERE status = 'PENDING'`;
        
        const rawCourses = await this.courseRepository.query(rawQuery, [limit, skip]);
        const rawCountResult = await this.courseRepository.query(rawCountQuery);
        const rawTotal = parseInt(rawCountResult[0]?.count || '0', 10);
        
        console.log('✅ Raw SQL query result:', {
          found: rawCourses.length,
          total: rawTotal
        });
        
        if (rawTotal > 0) {
          // Fetch lessons separately for each course
          const courseIds = rawCourses.map((row: any) => row.id);
          const allLessons = courseIds.length > 0 ? await this.lessonRepository.find({
            where: { courseId: In(courseIds) },
            order: { order: 'ASC' },
          }) : [];
          
          // Group lessons by courseId
          const lessonsByCourse = allLessons.reduce((acc: any, lesson: any) => {
            if (!acc[lesson.courseId]) {
              acc[lesson.courseId] = [];
            }
            acc[lesson.courseId].push(lesson);
            return acc;
          }, {});
          
          // Transform raw results to match Course entity structure
          const transformedCourses = rawCourses.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            shortDescription: row.shortDescription,
            status: row.status,
            level: row.level,
            price: row.price,
            isFree: row.isFree,
            thumbnail: row.thumbnail,
            images: row.images,
            duration: row.duration,
            lessonsCount: row.lessonsCount,
            studentsCount: row.studentsCount,
            rating: row.rating,
            reviewsCount: row.reviewsCount,
            tags: row.tags,
            language: row.language,
            creatorId: row.creatorId,
            categoryId: row.categoryId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            creator: row.creator_id ? {
              id: row.creator_id,
              email: row.creator_email,
              firstName: row.creator_firstName,
              lastName: row.creator_lastName,
            } : null,
            category: row.category_id ? {
              id: row.category_id,
              name: row.category_name,
            } : null,
            lessons: lessonsByCourse[row.id] || [],
          }));
          
          return { courses: transformedCourses, total: rawTotal };
        }
        
        // Last resort: get all and filter in memory
        console.log('⚠️ All queries returned 0, trying in-memory filter...');
        const allCourses = await this.courseRepository.find({ 
          relations: ['creator', 'category', 'lessons'],
          take: 1000 
        });
        const pendingCourses = allCourses.filter((c): c is Course => c.status === CourseStatus.PENDING);
        console.log('📊 In-memory filter found:', pendingCourses.length, 'pending courses');
        return { 
          courses: pendingCourses.slice(skip, skip + limit), 
          total: pendingCourses.length 
        };
      } catch (error) {
        console.error('❌ Error querying PENDING courses:', error);
        // Final fallback: get all and filter
        const allCourses = await this.courseRepository.find({ 
          relations: ['creator', 'category', 'lessons'],
          take: 1000 
        });
        const pendingCourses = allCourses.filter((c): c is Course => c.status === CourseStatus.PENDING);
        console.log('📊 Final fallback filter found:', pendingCourses.length, 'pending courses');
        return { 
          courses: pendingCourses.slice(skip, skip + limit), 
          total: pendingCourses.length 
        };
      }
    }

    // Check if user is admin (for non-PENDING requests)
    let isAdmin = false;
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      isAdmin = user?.role === UserRole.ADMIN;
      console.log('User check:', { userId, userRole: user?.role, isAdmin, userEmail: user?.email });
    } else {
      console.log('⚠️ No userId provided - user not authenticated');
    }

    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course.category', 'category');

    // Only show published courses to non-admins
    // Admins can see all courses, but can filter by status
    let hasWhereClause = false;
    
    console.log('Filter logic:', {
      hasStatusFilter: !!filterDto.status,
      statusFilter: filterDto.status,
      isAdmin,
      userId,
    });
    
    // For other statuses, use query builder
    if (filterDto.status) {
      console.log('✅ Applying status filter:', filterDto.status, 'isAdmin:', isAdmin, 'userId:', userId);
      queryBuilder.where('course.status = :status', { status: filterDto.status });
      hasWhereClause = true;
    } else if (!isAdmin) {
      // If no status filter and user is not admin, only show published courses
      console.log('Non-admin, no status filter - showing only published courses');
      queryBuilder.where('course.status = :status', { status: CourseStatus.PUBLISHED });
      hasWhereClause = true;
    } else {
      console.log('✅ Admin, no status filter - showing all courses');
    }
    // If admin and no status filter, show all courses (no where clause)

    // Apply filters
    if (filterDto.search) {
      const searchCondition = '(course.title ILIKE :search OR course.description ILIKE :search)';
      if (hasWhereClause) {
        queryBuilder.andWhere(searchCondition, { search: `%${filterDto.search}%` });
      } else {
        queryBuilder.where(searchCondition, { search: `%${filterDto.search}%` });
        hasWhereClause = true;
      }
    }

    if (filterDto.categoryId) {
      queryBuilder.andWhere('course.categoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto.level) {
      queryBuilder.andWhere('course.level = :level', { level: filterDto.level });
    }

    if (filterDto.language) {
      queryBuilder.andWhere('course.language = :language', {
        language: filterDto.language,
      });
    }

    if (filterDto.isFree !== undefined) {
      queryBuilder.andWhere('course.isFree = :isFree', { isFree: filterDto.isFree });
    }

    if (filterDto.minPrice !== undefined || filterDto.maxPrice !== undefined) {
      if (filterDto.minPrice !== undefined && filterDto.maxPrice !== undefined) {
        queryBuilder.andWhere('course.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: filterDto.minPrice,
          maxPrice: filterDto.maxPrice,
        });
      } else if (filterDto.minPrice !== undefined) {
        queryBuilder.andWhere('course.price >= :minPrice', {
          minPrice: filterDto.minPrice,
        });
      } else if (filterDto.maxPrice !== undefined) {
        queryBuilder.andWhere('course.price <= :maxPrice', {
          maxPrice: filterDto.maxPrice,
        });
      }
    }

    // Sorting
    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`course.${sortBy}`, sortOrder);

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Log the SQL query for debugging
    const sql = queryBuilder.getSql();
    const params = queryBuilder.getParameters();
    console.log('📝 SQL Query:', sql);
    console.log('📝 Query Parameters:', params);

    const [courses, total] = await queryBuilder.getManyAndCount();
    
    console.log('✅ Query result:', {
      coursesCount: courses.length,
      total,
      statusFilter: filterDto.status,
      isAdmin,
      userId,
    });

    return { courses, total };
  }

  async findOne(id: string, userId?: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['creator', 'category', 'lessons'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is enrolled or is the creator/admin
    if (userId) {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { userId, courseId: id },
      });
      // Add enrollment info if exists
      (course as any).isEnrolled = !!enrollment;
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only creator or admin can update
    if (course.creatorId !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own courses');
    }

    // Can't update if published (unless admin)
    if (course.status === CourseStatus.PUBLISHED && user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Cannot update published course');
    }

    Object.assign(course, updateCourseDto);
    if (updateCourseDto.price !== undefined) {
      course.isFree = updateCourseDto.price === 0;
    }

    return await this.courseRepository.save(course);
  }

  async remove(id: string, userId: string): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only creator or admin can delete
    if (course.creatorId !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepository.remove(course);
  }

  async submitForReview(id: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.creatorId !== userId) {
      throw new ForbiddenException('You can only submit your own courses');
    }

    if (course.status !== CourseStatus.DRAFT) {
      throw new BadRequestException('Only draft courses can be submitted for review');
    }

    // Validate course has at least one lesson - query directly from database
    const lessonsCount = await this.lessonRepository.count({ 
      where: { courseId: id, isActive: true } 
    });
    
    if (lessonsCount === 0) {
      throw new BadRequestException('Course must have at least one lesson');
    }

    // Update lessons count before submitting
    course.lessonsCount = lessonsCount;
    course.status = CourseStatus.PENDING;
    return await this.courseRepository.save(course);
  }

  async publish(id: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can publish courses');
    }

    if (course.status !== CourseStatus.PENDING) {
      throw new BadRequestException('Only pending courses can be published');
    }

    course.status = CourseStatus.PUBLISHED;
    course.reviewedBy = userId;
    course.reviewedAt = new Date();

    return await this.courseRepository.save(course);
  }

  async reject(id: string, rejectionReason: string, userId: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can reject courses');
    }

    course.status = CourseStatus.REJECTED;
    course.rejectionReason = rejectionReason;
    course.reviewedBy = userId;
    course.reviewedAt = new Date();

    return await this.courseRepository.save(course);
  }

  async enroll(courseId: string, userId: string): Promise<Enrollment> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new BadRequestException('Can only enroll in published courses');
    }

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    // TODO: Check payment if course is not free

    const enrollment = this.enrollmentRepository.create({
      userId,
      courseId,
      progress: 0,
    });

    // Update course students count
    course.studentsCount += 1;
    await this.courseRepository.save(course);

    return await this.enrollmentRepository.save(enrollment);
  }

  async getMyCourses(userId: string, role: UserRole): Promise<Course[]> {
    if (role === UserRole.CREATOR || role === UserRole.ADMIN) {
      // Get courses created by user
      return await this.courseRepository.find({
        where: { creatorId: userId },
        relations: ['category'],
        order: { createdAt: 'DESC' },
      });
    } else {
      // Get courses user is enrolled in
      const enrollments = await this.enrollmentRepository.find({
        where: { userId },
        relations: ['course', 'course.category'],
      });
      return enrollments.map((enrollment) => enrollment.course);
    }
  }

  async getCourseLessons(courseId: string, userId?: string): Promise<Lesson[]> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is enrolled or is creator/admin
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const isCreator = course.creatorId === userId;
      const isAdmin = user?.role === UserRole.ADMIN;
      const enrollment = await this.enrollmentRepository.findOne({
        where: { userId, courseId },
      });

      // Creators and admins can see all lessons (including inactive) for their courses
      if (isCreator || isAdmin) {
        return await this.lessonRepository.find({
          where: { courseId },
          order: { order: 'ASC' },
        });
      }

      if (!enrollment && course.status !== CourseStatus.PUBLISHED) {
        throw new ForbiddenException('You must be enrolled to view lessons');
      }
    } else if (course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException('Course is not published');
    }

    // For enrolled users or public, only show active lessons
    return await this.lessonRepository.find({
      where: { courseId, isActive: true },
      order: { order: 'ASC' },
    });
  }

  async createLesson(
    courseId: string,
    createLessonDto: CreateLessonDto,
    userId: string,
  ): Promise<Lesson> {
    // Validate courseId is provided
    if (!courseId || courseId.trim() === '') {
      throw new BadRequestException('Course ID is required');
    }

    // Don't load lessons relation to avoid TypeORM trying to manage it
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only creator or admin can add lessons
    if (course.creatorId !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }

    // Can't add lessons if published (unless admin)
    if (course.status === CourseStatus.PUBLISHED && user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Cannot add lessons to published course');
    }

    // Get the next order number
    const existingLessons = await this.lessonRepository.find({
      where: { courseId },
      order: { order: 'DESC' },
      take: 1,
    });
    const nextOrder = existingLessons.length > 0 ? existingLessons[0].order + 1 : 0;

    // Prepare lesson data with courseId explicitly set
    const lessonData = {
      title: createLessonDto.title,
      description: createLessonDto.description || null,
      courseId: courseId, // Explicitly set courseId (required)
      order: createLessonDto.order ?? nextOrder,
      type: createLessonDto.type ?? LessonType.VIDEO,
      videoUrl: createLessonDto.videoUrl || null,
      pdfUrl: createLessonDto.pdfUrl || null,
      duration: createLessonDto.duration !== undefined && createLessonDto.duration !== null ? Number(createLessonDto.duration) : null,
      isPreview: createLessonDto.isPreview ?? false,
      isActive: createLessonDto.isActive ?? true,
    };

    try {
      // Use raw query to insert lesson - this completely bypasses TypeORM's relation management
      const queryRunner = this.lessonRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Insert lesson using raw SQL to avoid TypeORM relation issues
        const insertQuery = `
          INSERT INTO lessons (
            "id", "courseId", "title", "description", "type", 
            "videoUrl", "pdfUrl", "order", "duration", 
            "isPreview", "isActive", "createdAt", "updatedAt"
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          ) RETURNING id
        `;
        
        const result = await queryRunner.query(insertQuery, [
          courseId, // $1 - explicitly pass courseId
          lessonData.title, // $2
          lessonData.description || null, // $3
          lessonData.type, // $4
          lessonData.videoUrl || null, // $5
          lessonData.pdfUrl || null, // $6
          lessonData.order, // $7
          lessonData.duration || null, // $8
          lessonData.isPreview || false, // $9
          lessonData.isActive !== undefined ? lessonData.isActive : true, // $10
        ]);

        const lessonId = result[0].id;
        
        // Update course lessons count within the transaction
        const lessonsCount = await queryRunner.query(
          'SELECT COUNT(*) as count FROM lessons WHERE "courseId" = $1',
          [courseId]
        );
        
        await queryRunner.query(
          'UPDATE courses SET "lessonsCount" = $1 WHERE "id" = $2',
          [parseInt(lessonsCount[0].count), courseId]
        );
        
        await queryRunner.commitTransaction();

        // Fetch the lesson after transaction - use a fresh query to avoid TypeORM tracking issues
        const savedLesson = await this.lessonRepository
          .createQueryBuilder('lesson')
          .where('lesson.id = :id', { id: lessonId })
          .getOne();

        if (!savedLesson) {
          throw new BadRequestException('Failed to create lesson');
        }

        return savedLesson;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error saving lesson:', error);
      throw new BadRequestException(
        error.message || 'Failed to create lesson. Please check your input data.',
      );
    }
  }

  async updateLesson(
    courseId: string,
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
    userId: string,
  ): Promise<Lesson> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, courseId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only creator or admin can update lessons
    if (course.creatorId !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update lessons in your own courses');
    }

    // Can't update if published (unless admin)
    if (course.status === CourseStatus.PUBLISHED && user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Cannot update lessons in published course');
    }

    Object.assign(lesson, updateLessonDto);
    return await this.lessonRepository.save(lesson);
  }

  async deleteLesson(courseId: string, lessonId: string, userId: string): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, courseId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only creator or admin can delete lessons
    if (course.creatorId !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete lessons from your own courses');
    }

    // Can't delete if published (unless admin)
    if (course.status === CourseStatus.PUBLISHED && user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Cannot delete lessons from published course');
    }

    await this.lessonRepository.remove(lesson);

    // Update course lessons count
    const lessonsCount = await this.lessonRepository.count({ where: { courseId } });
    course.lessonsCount = lessonsCount;
    await this.courseRepository.save(course);
  }
}

