import { Matches } from 'class-validator';

export class UpdateUserDto {
  username?: string;
  email?: string;

  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: 'Birthday must be formatted as yyyy-mm-dd',
  })
  birthday?: string;
}
