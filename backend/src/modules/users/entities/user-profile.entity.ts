import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  language: string; // 'en' or 'am'

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



