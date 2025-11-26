import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':courseId/lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  async markLessonComplete(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.progressService.markLessonComplete(courseId, lessonId, user.id);
  }

  @Put(':courseId/lessons/:lessonId/progress')
  @HttpCode(HttpStatus.OK)
  async updateLessonProgress(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() body: { watchedDuration: number; lastPosition?: number },
    @CurrentUser() user: User,
  ) {
    return this.progressService.updateLessonProgress(
      courseId,
      lessonId,
      user.id,
      body.watchedDuration,
      body.lastPosition,
    );
  }

  @Get(':courseId/progress')
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @CurrentUser() user: User,
  ) {
    return this.progressService.getCourseProgress(courseId, user.id);
  }
}

