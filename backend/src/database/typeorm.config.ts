import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../modules/auth/entities/user.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';
import { UserProfile } from '../modules/users/entities/user-profile.entity';
import { CreatorApplication } from '../modules/admin/entities/creator-application.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { Enrollment } from '../modules/courses/entities/enrollment.entity';
import { Category } from '../modules/courses/entities/category.entity';
import { LessonProgress } from '../modules/courses/entities/lesson-progress.entity';
import { Media } from '../modules/media/entities/media.entity';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    RefreshToken,
    UserProfile,
    CreatorApplication,
    Course,
    Lesson,
    Enrollment,
    Category,
    LessonProgress,
    Media,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Always false when using migrations
  logging: true,
  ssl: {
    rejectUnauthorized: false, // Required for Neon database
  },
});

