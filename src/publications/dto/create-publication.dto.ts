import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  content: string;
}
