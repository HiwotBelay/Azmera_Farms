import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('courses/:courseId/quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('courseId') courseId: string,
    @Body() createQuizDto: CreateQuizDto,
    @CurrentUser() user: User,
  ) {
    return this.quizzesService.create({ ...createQuizDto, courseId }, user.id);
  }

  @Get()
  async findAll(@Param('courseId') courseId: string) {
    return this.quizzesService.findAll(courseId);
  }

  @Get(':quizId')
  async findOne(@Param('quizId') quizId: string) {
    return this.quizzesService.findOne(quizId);
  }

  @Post(':quizId/questions')
  @HttpCode(HttpStatus.CREATED)
  async addQuestion(
    @Param('quizId') quizId: string,
    @Body() questionDto: CreateQuizQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.quizzesService.addQuestion(quizId, questionDto, user.id);
  }

  @Post(':quizId/start')
  @HttpCode(HttpStatus.CREATED)
  async startAttempt(
    @Param('quizId') quizId: string,
    @CurrentUser() user: User,
  ) {
    return this.quizzesService.startAttempt(quizId, user.id);
  }

  @Post('attempts/:attemptId/submit')
  @HttpCode(HttpStatus.OK)
  async submitAttempt(
    @Param('attemptId') attemptId: string,
    @Body() submitDto: SubmitQuizAttemptDto,
    @CurrentUser() user: User,
  ) {
    return this.quizzesService.submitAttempt(attemptId, submitDto, user.id);
  }

  @Get('attempts/:attemptId')
  async getAttempt(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: User,
  ) {
    return this.quizzesService.getAttempt(attemptId, user.id);
  }

  @Get(':quizId/attempts')
  async getUserAttempts(
    @Param('quizId') quizId: string,
    @CurrentUser() user: User,
  ) {
    return this.quizzesService.getUserAttempts(quizId, user.id);
  }

  @Delete(':quizId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('quizId') quizId: string,
    @CurrentUser() user: User,
  ) {
    await this.quizzesService.delete(quizId, user.id);
  }
}

