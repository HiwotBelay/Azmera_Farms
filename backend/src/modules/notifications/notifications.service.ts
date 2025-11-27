import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from '../auth/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const user = await this.userRepository.findOne({
      where: { id: createNotificationDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Send email notification (async, don't wait)
    this.sendEmailNotification(savedNotification, user).catch((error) => {
      console.error('Failed to send email notification:', error);
    });

    return savedNotification;
  }

  async createForMultipleUsers(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<Notification[]> {
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });

    if (users.length === 0) {
      throw new BadRequestException('No valid users found');
    }

    const notifications = users.map((user) =>
      this.notificationRepository.create({
        userId: user.id,
        type,
        title,
        message,
        data,
      }),
    );

    const savedNotifications = await this.notificationRepository.save(notifications);

    // Send email notifications (async)
    savedNotifications.forEach((notification, index) => {
      this.sendEmailNotification(notification, users[index]).catch((error) => {
        console.error('Failed to send email notification:', error);
      });
    });

    return savedNotifications;
  }

  async findAll(userId: string, unreadOnly = false): Promise<Notification[]> {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    return await this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50, // Limit to 50 most recent
    });
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    notification.readAt = new Date();

    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, read: false },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepository.remove(notification);
  }

  private async sendEmailNotification(
    notification: Notification,
    user: User,
  ): Promise<void> {
    // Only send email for important notifications
    const importantTypes = [
      NotificationType.COURSE_APPROVED,
      NotificationType.COURSE_REJECTED,
      NotificationType.CREATOR_APPLICATION_APPROVED,
      NotificationType.CREATOR_APPLICATION_REJECTED,
      NotificationType.PAYMENT_SUCCESS,
      NotificationType.PAYMENT_FAILED,
      NotificationType.CERTIFICATE_ISSUED,
    ];

    if (importantTypes.includes(notification.type)) {
      try {
        await this.emailService.sendNotificationEmail(user, notification);
        notification.emailSent = true;
        await this.notificationRepository.save(notification);
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }
  }
}

