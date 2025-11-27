import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/auth/entities/user.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';
import { UserProfile } from '../modules/users/entities/user-profile.entity';
import { CreatorApplication } from '../modules/admin/entities/creator-application.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Section } from '../modules/courses/entities/section.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { Enrollment } from '../modules/courses/entities/enrollment.entity';
import { Category } from '../modules/courses/entities/category.entity';
import { LessonProgress } from '../modules/courses/entities/lesson-progress.entity';
import { Media } from '../modules/media/entities/media.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { Quiz } from '../modules/courses/entities/quiz.entity';
import { QuizQuestion } from '../modules/courses/entities/quiz-question.entity';
import { QuizAttempt } from '../modules/courses/entities/quiz-attempt.entity';
import { QuizAnswer } from '../modules/courses/entities/quiz-answer.entity';
import { Review } from '../modules/courses/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        // If DATABASE_URL is provided, parse it for Neon PostgreSQL
        if (databaseUrl) {
          try {
            // Parse the connection URL
            const url = new URL(databaseUrl);
            const params = new URLSearchParams(url.search);
            
            return {
              type: 'postgres',
              host: url.hostname,
              port: parseInt(url.port) || 5432,
              username: decodeURIComponent(url.username),
              password: decodeURIComponent(url.password),
              database: url.pathname.slice(1).split('?')[0], // Remove leading '/' and query params
              entities: [
                User,
                RefreshToken,
                UserProfile,
                CreatorApplication,
                Course,
                Section,
                Lesson,
                Enrollment,
                Category,
                LessonProgress,
                Media,
                Notification,
                Quiz,
                QuizQuestion,
                QuizAttempt,
                QuizAnswer,
                Review,
              ],
              synchronize: configService.get('NODE_ENV') === 'development',
              logging: configService.get('NODE_ENV') === 'development',
              ssl: params.get('sslmode') === 'require' || params.get('ssl') === 'true' ? {
                rejectUnauthorized: false, // Required for Neon database
              } : false,
              extra: {
                max: 10, // Maximum number of connections
                connectionTimeoutMillis: 10000,
              },
            };
          } catch (error) {
            // Fallback: use URL directly if parsing fails
            console.warn('Failed to parse DATABASE_URL, using direct URL:', error);
            return {
              type: 'postgres',
              url: databaseUrl,
              entities: [
                User,
                RefreshToken,
                UserProfile,
                CreatorApplication,
                Course,
                Section,
                Lesson,
                Enrollment,
                Category,
                LessonProgress,
                Media,
                Notification,
                Quiz,
                QuizQuestion,
                QuizAttempt,
                QuizAnswer,
                Review,
              ],
              synchronize: configService.get('NODE_ENV') === 'development',
              logging: configService.get('NODE_ENV') === 'development',
              ssl: {
                rejectUnauthorized: false,
              },
              extra: {
                max: 10,
                connectionTimeoutMillis: 10000,
              },
            };
          }
        }
        
        // Fallback to individual connection parameters if DATABASE_URL is not provided
        return {
          type: 'postgres',
          host: configService.get('DB_HOST') || 'localhost',
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('DB_PASSWORD') || 'password',
          database: configService.get('DB_DATABASE') || 'azemera_academy',
          entities: [
            User,
            RefreshToken,
            UserProfile,
            CreatorApplication,
            Course,
            Section,
            Lesson,
            Enrollment,
            Category,
            LessonProgress,
            Media,
          ],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

