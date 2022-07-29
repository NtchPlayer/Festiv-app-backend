import { IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { User } from '../../users/user.entity';

export class CreateTagDto {
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^\B(#[0-z]+\b)(?!;)$/g)
  content: string;

  @IsNotEmpty()
  user: User;
}
