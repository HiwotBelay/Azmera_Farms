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
import { CreatorApplicationsService } from './creator-applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/entities/user.entity';

@Controller('admin/creator-applications')
@UseGuards(JwtAuthGuard)
export class CreatorApplicationsController {
  constructor(
    private readonly creatorApplicationsService: CreatorApplicationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createApplication(
    @CurrentUser() user: User,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.creatorApplicationsService.createApplication(
      user.id,
      createApplicationDto,
    );
  }

  @Get('my-application')
  async getMyApplication(@CurrentUser() user: User) {
    return this.creatorApplicationsService.getMyApplication(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllApplications(@CurrentUser() user: User) {
    return this.creatorApplicationsService.getAllApplications(user.id);
  }

  @Get(':id')
  async getApplicationById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.creatorApplicationsService.getApplicationById(id, user.id);
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async approveApplication(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.creatorApplicationsService.approveApplication(id, user.id);
  }

  @Put(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async rejectApplication(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
    @CurrentUser() user: User,
  ) {
    return this.creatorApplicationsService.rejectApplication(
      id,
      body.rejectionReason,
      user.id,
    );
  }

  @Put(':id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async reviewApplication(
    @Param('id') id: string,
    @Body() reviewDto: ReviewApplicationDto,
    @CurrentUser() user: User,
  ) {
    return this.creatorApplicationsService.reviewApplication(
      id,
      reviewDto,
      user.id,
    );
  }
}

