import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaStorageService } from './media-storage.service';
import { Media } from './entities/media.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, User])],
  controllers: [MediaController],
  providers: [MediaService, MediaStorageService],
  exports: [MediaService, MediaStorageService],
})
export class MediaModule {}

