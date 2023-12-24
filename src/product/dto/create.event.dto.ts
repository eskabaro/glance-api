import { IsString } from "class-validator"

export class CreateEventDto {
   @IsString()
   id: string

   @IsString()
   type: string
}