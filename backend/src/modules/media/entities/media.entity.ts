import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum MediaType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string; // Original filename

  @Column()
  url: string; // Full URL to the media file

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column({ type: 'bigint' })
  size: number; // File size in bytes

  @Column({ nullable: true })
  mimeType: string; // MIME type

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploadedBy' })
  uploadedByUser: User;

  @Column({ nullable: true })
  uploadedBy: string; // User ID who uploaded

  @Column({ nullable: true })
  thumbnailUrl: string; // Thumbnail URL for videos

  @Column({ nullable: true })
  hlsUrl: string; // HLS manifest URL for videos (if processed)

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    duration?: number; // Video/audio duration in seconds
    width?: number; // Image/video width
    height?: number; // Image/video height
    pages?: number; // PDF pages
    [key: string]: any;
  };

  @Column({ default: false })
  isProcessed: boolean; // Whether video has been processed to HLS

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

