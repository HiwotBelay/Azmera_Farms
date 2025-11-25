import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user basic fields
    if (updateProfileDto.firstName !== undefined) {
      user.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      user.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.email !== undefined && updateProfileDto.email !== user.email) {
      // Check if email is already taken
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email is already taken');
      }
      user.email = updateProfileDto.email;
      user.isEmailVerified = false; // Require re-verification if email changed
    }

    await this.userRepository.save(user);

    // Get or create user profile
    let userProfile = user.userProfile;
    if (!userProfile) {
      userProfile = this.userProfileRepository.create({ userId: user.id });
    }

    // Update profile fields
    if (updateProfileDto.phoneNumber !== undefined) {
      userProfile.phoneNumber = updateProfileDto.phoneNumber;
    }
    if (updateProfileDto.bio !== undefined) {
      userProfile.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.organization !== undefined) {
      userProfile.organization = updateProfileDto.organization;
    }
    if (updateProfileDto.location !== undefined) {
      userProfile.location = updateProfileDto.location;
    }
    if (updateProfileDto.language !== undefined) {
      userProfile.language = updateProfileDto.language;
    }
    if (updateProfileDto.profileImage !== undefined) {
      userProfile.profileImage = updateProfileDto.profileImage;
    }
    if (updateProfileDto.socialLinks !== undefined) {
      userProfile.socialLinks = updateProfileDto.socialLinks;
    }

    await this.userProfileRepository.save(userProfile);

    // Return updated user with profile
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userProfile'],
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async getUserById(id: string, requestingUserId?: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only return public information if not the same user
    const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, ...publicUser } = user;
    
    // If requesting user is viewing their own profile, return full info
    if (requestingUserId === id) {
      return publicUser;
    }

    // Otherwise return limited public info
    return {
      id: publicUser.id,
      firstName: publicUser.firstName,
      lastName: publicUser.lastName,
      role: publicUser.role,
      userProfile: publicUser.userProfile ? {
        bio: publicUser.userProfile.bio,
        organization: publicUser.userProfile.organization,
        profileImage: publicUser.userProfile.profileImage,
        socialLinks: publicUser.userProfile.socialLinks,
      } : null,
      createdAt: publicUser.createdAt,
    };
  }

  async getUserStats(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Add actual statistics when courses and enrollments modules are implemented
    // For now, return placeholder stats
    return {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalLessons: 0,
      completedLessons: 0,
      totalStudyTime: 0, // in minutes
      certificatesEarned: 0,
      joinDate: user.createdAt,
      lastActive: user.lastLoginAt || user.updatedAt,
    };
  }
}

