import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/auth/entities/user.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || configService.get('DATABASE_URL')?.split('@')[1]?.split(':')[0] || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || configService.get('DATABASE_URL')?.split('://')[1]?.split(':')[0] || 'postgres',
        password: configService.get('DB_PASSWORD') || configService.get('DATABASE_URL')?.split(':')[2]?.split('@')[0] || 'password',
        database: configService.get('DB_DATABASE') || configService.get('DATABASE_URL')?.split('/').pop() || 'azemera_academy',
        entities: [User, RefreshToken],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

