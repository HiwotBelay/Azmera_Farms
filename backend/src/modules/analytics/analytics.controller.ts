import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/entities/user.entity';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('platform')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }

  @Get('course/:courseId')
  async getCourseAnalytics(
    @Param('courseId') courseId: string,
    @CurrentUser() user: User,
  ) {
    return this.analyticsService.getCourseAnalytics(courseId, user.id);
  }

  @Get('user')
  async getUserAnalytics(@CurrentUser() user: User) {
    return this.analyticsService.getUserAnalytics(user.id);
  }

  @Get('revenue')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getRevenueReport(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}

