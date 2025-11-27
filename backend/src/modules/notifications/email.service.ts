import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class EmailService {
  // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
  // For now, this is a placeholder that logs the email

  async sendNotificationEmail(
    user: User,
    notification: Notification,
  ): Promise<void> {
    // Placeholder implementation
    // In production, integrate with actual email service
    console.log(`[Email] Sending notification to ${user.email}:`, {
      subject: notification.title,
      message: notification.message,
      type: notification.type,
    });

    // Example integration (uncomment when email service is configured):
    /*
    await this.emailClient.send({
      to: user.email,
      subject: notification.title,
      html: this.generateEmailTemplate(notification),
    });
    */
  }

  private generateEmailTemplate(notification: Notification): string {
    // Generate HTML email template
    return `
      <html>
        <body>
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
          <p>Best regards,<br>Azemera Academy</p>
        </body>
      </html>
    `;
  }
}

