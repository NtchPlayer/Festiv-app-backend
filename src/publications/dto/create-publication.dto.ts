import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  tags: [];
}
