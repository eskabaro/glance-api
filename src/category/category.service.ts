import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
   constructor(private readonly prisma: PrismaService) { }

   async getAll() {
      return await this.prisma.category.findMany()
   }

   async getCategoryBySlug(slug: string) {
      const data = await this.prisma.category.findUnique({
         where: { slug }
      })

      if (!data) throw new NotFoundException("Категория не найдена")

      return data
   }
}
