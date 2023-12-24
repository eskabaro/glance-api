import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CreateDto } from './dto/create.dto';
import { CreateEventDto } from './dto/create.event.dto';

@Injectable()
export class ProductService {
   private readonly s3client = new S3Client({
      region: this.configService.getOrThrow("AWS_S3_REGION")
   })

   constructor(
      private readonly prisma: PrismaService,
      private readonly configService: ConfigService
   ) { }

   async getAll(category?: string) {
      const where = category ? { categorySlug: category } : {}

      const products = await this.prisma.product.findMany({ where, include: { ivents: true } })

      if (!products) throw new HttpException("Произошла ошибка при получении продуктов", HttpStatus.INTERNAL_SERVER_ERROR)

      return products
   }

   async getById(id: string) {
      const product = await this.prisma.product.findUnique({
         where: { id: id },
         include: { reviews: true, ivents: true }
      })

      if (!product) throw new NotFoundException("Товар не найден")

      return product
   }

   async getSales() {
      const salesProducts = await this.prisma.product.findMany({
         where: {
            sale: { not: null }
         }
      })

      return salesProducts
   }

   async createProduct(files: Express.Multer.File[], dto: CreateDto) {
      const images = files.map(item => {
         this.s3client.send(
            new PutObjectCommand({
               Bucket: "glance-api",
               Key: item.originalname,
               Body: item.buffer,
               ACL: "public-read",
               ContentDisposition: "inline"
            })
         )

         return this.getUrlFromBucket(item.originalname)
      })

      const product = await this.prisma.product.create({
         data: {
            mainImage: images[0],
            images: images,
            title: dto.title,
            price: dto.price,
            sale: dto.sale,
            color: dto.color,
            inStock: dto.inStock,
            stars: 0,
            category: dto.category,
            categorySlug: dto.slug,
            characteristics: dto.characteristics,
            reviews: { create: [] },
            ivents: { create: [] }
         },
         include: {
            reviews: true,
            ivents: true
         }
      })

      return product
   }

   async createProductIvent(dto: CreateEventDto) {
      try {
         const event = await this.prisma.productIvetn.create({
            data: {
               productId: dto.id,
               type: dto.type
            },
         })

         return event
      } catch (error) {
         throw new BadRequestException("Не удалось создать ивент для товара")
      }
   }

   private getUrlFromBucket(fileName: string) {
      return `https://glance-api.s3.${this.configService.getOrThrow("AWS_S3_REGION")}.amazonaws.com/${fileName}`
   }
}
