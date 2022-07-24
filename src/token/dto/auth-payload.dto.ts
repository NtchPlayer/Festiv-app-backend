import { User } from '../../users/user.entity';

export interface AuthPayloadDto {
  user: User;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}
