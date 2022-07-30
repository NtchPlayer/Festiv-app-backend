import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Matches,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(36)
  @Matches(/^\w+$/g)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(36)
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too week!',
  })
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isProfessional: boolean;

  @IsOptional()
  @IsArray()
  tags: [{ content: string }];
}
