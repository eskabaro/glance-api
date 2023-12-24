import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDto {
   @IsString()
   title: string

   @IsString()
   price: string

   @IsOptional()
   @IsString()
   sale?: string

   @IsOptional()
   @IsString()
   color?: string

   @IsString()
   inStock: string

   @IsString()
   category: string

   @IsString()
   slug: string

   @IsString()
   characteristics: string
}