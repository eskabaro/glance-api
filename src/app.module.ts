import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule, ConfigModule.forRoot({ isGlobal: true }), CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
