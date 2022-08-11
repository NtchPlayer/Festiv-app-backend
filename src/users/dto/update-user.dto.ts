import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(2)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
    message: 'Birthday must be formatted as yyyy-mm-dd',
  })
  //@MaxDate(new Date('2009-07-30'))
  birthday?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsArray()
  tags: [{ content: string; id?: number }];

  @IsOptional()
  @IsString()
  oldPassword: string;

  @IsOptional()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too week!',
  })
  @IsString()
  newPassword: string;
}
