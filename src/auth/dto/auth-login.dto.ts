import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'An email is required' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'A password is required to login' })
  @IsString()
  password: string;
}
