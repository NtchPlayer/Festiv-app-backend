import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  content: string;

  // @IsUrl()
  // media: string;
}
