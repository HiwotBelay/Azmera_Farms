import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './entities/media.entity';
import { User } from '../auth/entities/user.entity';
import { MediaStorageService } from './media-storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mediaStorageService: MediaStorageService,
  ) {}

  async uploadVideo(
    file: Express.Multer.File,
    userId: string,
  ): Promise<Media> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedVideoTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid video file type');
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 500MB limit');
    }

    // Upload to storage
    const { url, key } = await this.mediaStorageService.uploadFile(file, 'videos');

    // Create media record
    const media = this.mediaRepository.create({
      filename: file.originalname,
      url,
      type: MediaType.VIDEO,
      size: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
      isProcessed: false, // Will be processed to HLS later
    });

    const savedMedia = await this.mediaRepository.save(media);

    // TODO: Queue video for HLS processing with ffmpeg
    // This would typically be done in a background job

    return savedMedia;
  }

  async uploadPdf(
    file: Express.Multer.File,
    userId: string,
  ): Promise<Media> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Invalid PDF file type');
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 50MB limit');
    }

    // Upload to storage
    const { url, key } = await this.mediaStorageService.uploadFile(file, 'pdfs');

    // Create media record
    const media = this.mediaRepository.create({
      filename: file.originalname,
      url,
      type: MediaType.PDF,
      size: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
    });

    return await this.mediaRepository.save(media);
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['uploadedByUser'],
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async delete(id: string, userId: string): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['uploadedByUser'],
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only owner or admin can delete
    if (media.uploadedBy !== userId && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own media');
    }

    // Delete from storage
    // Extract key from URL or store key separately
    // await this.mediaStorageService.deleteFile(media.key);

    // Delete from database
    await this.mediaRepository.remove(media);
  }

  async getStreamUrl(id: string): Promise<string> {
    const media = await this.mediaRepository.findOne({ where: { id } });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.type !== MediaType.VIDEO) {
      throw new BadRequestException('Only videos can be streamed');
    }

    // Return HLS URL if processed, otherwise return original URL
    return media.hlsUrl || media.url;
  }
}

