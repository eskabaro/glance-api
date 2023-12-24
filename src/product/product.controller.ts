import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateDto } from './dto/create.dto';
import { CreateEventDto } from './dto/create.event.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get("")
  async getAll(@Query("category") category: string) {
    return await this.productService.getAll(category)
  }

  @Get("single/:id")
  async getById(@Param("id") id: string) {
    return await this.productService.getById(id)
  }

  @Get("sales")
  async getSales() {
    return await this.productService.getSales()
  }

  @Post("")
  @UsePipes(new ValidationPipe)
  @UseInterceptors(FilesInterceptor("files"))
  async createProduct(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: "image/png" })
      ]
    })
  ) files: Express.Multer.File[], @Body() dto: CreateDto) {
    return await this.productService.createProduct(files, dto)
  }

  @Post("event")
  async createProductEvent(@Body() dto: CreateEventDto) {
    return await this.productService.createProductIvent(dto)
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    console.log(id)
  }
}
