import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CoursesService } from '../courses/courses.service';
import { FilterCoursesDto } from '../courses/dto/filter-courses.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('users')
  async getAllUsers(
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllUsers({ role, search, page, limit });
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: { role?: UserRole; isActive?: boolean; firstName?: string; lastName?: string },
  ) {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @CurrentUser() admin: User) {
    await this.adminService.deleteUser(id, admin.id);
  }

  @Get('courses')
  async getCourses(@Query() filterDto: FilterCoursesDto, @CurrentUser() user: User) {
    // Admin-specific courses endpoint - proxies to courses service
    // This ensures admins can always access courses with their admin privileges
    console.log('🔍 Admin courses endpoint called:', {
      userId: user.id,
      userRole: user.role,
      statusFilter: filterDto.status,
      filterDto: JSON.stringify(filterDto),
    });
    return this.coursesService.findAll(filterDto, user.id);
  }
}

