import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get("")
  async getAll() {
    return await this.categoryService.getAll()
  }

  @Get(":slug")
  async getCategoryBySlug(@Param("slug") slug: string) {
    return await this.categoryService.getCategoryBySlug(slug)
  }
}
