import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ProgressService } from '../courses/progress.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly progressService: ProgressService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.getUserById(id, currentUser.id);
  }

  @Get('me/stats')
  async getUserStats(@CurrentUser() user: User) {
    return this.usersService.getUserStats(user.id);
  }

  @Get('me/progress')
  async getAllUserProgress(@CurrentUser() user: User) {
    return this.progressService.getAllUserProgress(user.id);
  }
}



