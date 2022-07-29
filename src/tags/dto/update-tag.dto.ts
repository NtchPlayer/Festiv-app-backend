import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdateTagDto {
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^\B(#[0-z]+\b)(?!;)$/g)
  content: string;
}
