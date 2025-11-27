import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category with same name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      isActive: createCategoryDto.isActive ?? true,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(includeInactive = false): Promise<Category[]> {
    const where = includeInactive ? {} : { isActive: true };
    return await this.categoryRepository.find({
      where,
      relations: ['courses'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['courses'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // If name is being updated, check for conflicts
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['courses'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has courses
    if (category.courses && category.courses.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with associated courses. Please remove or reassign courses first.',
      );
    }

    await this.categoryRepository.remove(category);
  }

  async getCategoryStats(id: string): Promise<{
    category: Category;
    totalCourses: number;
    publishedCourses: number;
    totalStudents: number;
  }> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['courses', 'courses.enrollments'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const totalCourses = category.courses?.length || 0;
    const publishedCourses =
      category.courses?.filter((c) => c.status === 'PUBLISHED').length || 0;
    const totalStudents =
      category.courses?.reduce(
        (sum, course) => sum + (course.enrollments?.length || 0),
        0,
      ) || 0;

    return {
      category,
      totalCourses,
      publishedCourses,
      totalStudents,
    };
  }
}

