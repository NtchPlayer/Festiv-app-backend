import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'An email is required' })
  email: string;

  @IsNotEmpty({ message: 'A password is required to login' })
  password: string;
}
