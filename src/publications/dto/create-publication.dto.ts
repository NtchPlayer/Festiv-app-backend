import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @MinLength(2)
  media: string;
}
