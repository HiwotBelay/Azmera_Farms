import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/auth/entities/user.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';
import { UserProfile } from '../modules/users/entities/user-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        // If DATABASE_URL is provided, use it directly (TypeORM supports this)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, RefreshToken, UserProfile],
            synchronize: configService.get('NODE_ENV') === 'development',
            logging: configService.get('NODE_ENV') === 'development',
            ssl: {
              rejectUnauthorized: false, // Required for Neon database
            },
          };
        }
        
        // Fallback to individual connection parameters if DATABASE_URL is not provided
        return {
          type: 'postgres',
          host: configService.get('DB_HOST') || 'localhost',
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('DB_PASSWORD') || 'password',
          database: configService.get('DB_DATABASE') || 'azemera_academy',
          entities: [User, RefreshToken],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

