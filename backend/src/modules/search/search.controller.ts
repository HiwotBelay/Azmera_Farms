import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('courses')
  @UseGuards(OptionalJwtAuthGuard)
  async searchCourses(
    @Query('q') query: string,
    @Query('categoryId') categoryId?: string,
    @Query('level') level?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isFree') isFree?: string,
    @Query('language') language?: string,
  ) {
    const filters = {
      categoryId,
      level,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      isFree: isFree === 'true' ? true : isFree === 'false' ? false : undefined,
      language,
    };

    return this.searchService.searchCourses(query || '', filters);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.getRecommendations(user.id, limit ? parseInt(limit) : 10);
  }

  @Get('popular')
  async getPopularCourses(@Query('limit') limit?: string) {
    return this.searchService.getPopularCourses(limit ? parseInt(limit) : 10);
  }

  @Get('trending')
  async getTrendingCourses(@Query('limit') limit?: string) {
    return this.searchService.getTrendingCourses(limit ? parseInt(limit) : 10);
  }
}

