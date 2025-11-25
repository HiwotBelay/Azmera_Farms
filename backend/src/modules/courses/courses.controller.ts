import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/entities/user.entity';
import { CourseStatus } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: User) {
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  findAll(
    @Query('status') status?: CourseStatus,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
  ) {
    return this.coursesService.findAll({ status, category, level, search });
  }

  @Get('my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  getMyCourses(@CurrentUser() user: User) {
    return this.coursesService.getMyCourses(user.id);
  }

  @Get('enrolled')
  @UseGuards(JwtAuthGuard)
  getEnrollments(@CurrentUser() user: User) {
    return this.coursesService.getEnrollments(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    // Increment views
    this.coursesService.incrementViews(id).catch(() => {
      // Silently fail if view increment fails
    });
    return course;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.update(id, updateCourseDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.coursesService.remove(id, user.id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  enroll(@Param('id') courseId: string, @CurrentUser() user: User) {
    return this.coursesService.enroll(courseId, user.id);
  }

  @Patch(':id/progress')
  @UseGuards(JwtAuthGuard)
  updateProgress(
    @Param('id') courseId: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.updateProgress(courseId, user.id, updateProgressDto);
  }
}

