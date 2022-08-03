import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  tags: [];

  @IsOptional()
  @IsNumberString()
  parentId: string;
}
