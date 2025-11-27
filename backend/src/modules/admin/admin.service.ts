import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../auth/entities/user.entity';
import { Course, CourseStatus } from '../courses/entities/course.entity';
import { Enrollment } from '../courses/entities/enrollment.entity';
import { CreatorApplication, ApplicationStatus } from './entities/creator-application.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(CreatorApplication)
    private applicationRepository: Repository<CreatorApplication>,
  ) {}

  async getPlatformStats() {
    const [
      totalUsers,
      totalLearners,
      totalCreators,
      totalAdmins,
      totalCourses,
      publishedCourses,
      pendingCourses,
      draftCourses,
      rejectedCourses,
      totalEnrollments,
      pendingApplications,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.LEARNER } }),
      this.userRepository.count({ where: { role: UserRole.CREATOR } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.courseRepository.count(),
      this.courseRepository.count({ where: { status: CourseStatus.PUBLISHED } }),
      this.courseRepository.count({ where: { status: CourseStatus.PENDING } }),
      this.courseRepository.count({ where: { status: CourseStatus.DRAFT } }),
      this.courseRepository.count({ where: { status: CourseStatus.REJECTED } }),
      this.enrollmentRepository.count(),
      this.applicationRepository.count({ where: { status: ApplicationStatus.PENDING } }),
    ]);

    return {
      users: {
        total: totalUsers,
        learners: totalLearners,
        creators: totalCreators,
        admins: totalAdmins,
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        pending: pendingCourses,
        draft: draftCourses,
        rejected: rejectedCourses,
      },
      enrollments: {
        total: totalEnrollments,
      },
      applications: {
        pending: pendingApplications,
      },
    };
  }

  async getAllUsers(filters: {
    role?: UserRole;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ?? 0;
    const limit = filters.limit ?? 20;
    const skip = page * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters.role) {
      queryBuilder.where('user.role = :role', { role: filters.role });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPasswords,
      total,
      page,
      limit,
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(
    id: string,
    updateData: {
      role?: UserRole;
      isActive?: boolean;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent changing own role or deactivating self
    if (updateData.role && updateData.role !== user.role) {
      user.role = updateData.role;
    }

    if (updateData.isActive !== undefined) {
      user.isActive = updateData.isActive;
    }

    if (updateData.firstName !== undefined) {
      user.firstName = updateData.firstName;
    }

    if (updateData.lastName !== undefined) {
      user.lastName = updateData.lastName;
    }

    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string, adminId: string) {
    if (id === adminId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }
}

