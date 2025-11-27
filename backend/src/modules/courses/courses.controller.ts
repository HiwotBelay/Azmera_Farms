import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCoursesDto } from './dto/filter-courses.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CourseStatus } from './entities/course.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/entities/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Query() filterDto: FilterCoursesDto, @CurrentUser() user?: User, @Req() req?: Request) {
    // Log for debugging
    const authHeader = req?.headers?.authorization;
    const rawStatus = req?.query?.status;
    
    // CRITICAL: Always check raw query param for PENDING status
    // This ensures we catch it even if DTO transformation fails
    const rawStatusUpper = rawStatus?.toString().toUpperCase().trim();
    if (rawStatusUpper === 'PENDING' && (!filterDto.status || filterDto.status.toString().toUpperCase() !== 'PENDING')) {
      filterDto.status = CourseStatus.PENDING;
      console.log('🔧 FORCED status to PENDING from raw query param');
    }
    
    console.log('🔍 Courses findAll called:', {
      hasUser: !!user,
      userId: user?.id,
      userRole: user?.role,
      statusFilter: filterDto.status,
      rawStatusFromQuery: rawStatus,
      rawStatusUpper,
      statusType: typeof filterDto.status,
      hasAuthHeader: !!authHeader,
      authHeaderPrefix: authHeader?.substring(0, 20),
      fullFilterDto: JSON.stringify(filterDto),
    });
    
    return this.coursesService.findAll(filterDto, user?.id);
  }

  @Get('my-courses')
  @UseGuards(JwtAuthGuard)
  async getMyCourses(@CurrentUser() user: User) {
    return this.coursesService.getMyCourses(user.id, user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.coursesService.findOne(id, user?.id);
  }

  @Get(':id/lessons')
  async getCourseLessons(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.coursesService.getCourseLessons(id, user?.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.update(id, updateCourseDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.coursesService.remove(id, user.id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitForReview(@Param('id') id: string, @CurrentUser() user: User) {
    return this.coursesService.submitForReview(id, user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string, @CurrentUser() user: User) {
    return this.coursesService.publish(id, user.id);
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async accept(@Param('id') id: string, @CurrentUser() user: User) {
    return this.coursesService.accept(id, user.id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
    @CurrentUser() user: User,
  ) {
    return this.coursesService.reject(id, body.rejectionReason, user.id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async enroll(@Param('id') id: string, @CurrentUser() user: User) {
    return this.coursesService.enroll(id, user.id);
  }

  // Lesson Management Endpoints
  @Post(':courseId/lessons')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createLesson(
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.createLesson(courseId, createLessonDto, user.id);
  }

  @Put(':courseId/lessons/:lessonId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.updateLesson(courseId, lessonId, updateLessonDto, user.id);
  }

  @Delete(':courseId/lessons/:lessonId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: User,
  ) {
    await this.coursesService.deleteLesson(courseId, lessonId, user.id);
  }
}

