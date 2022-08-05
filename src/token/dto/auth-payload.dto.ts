export interface AuthPayloadDto {
  id: number;
  email: string;
  name: string;
  avatar: string;
  accessToken: string;
  refresh_token?: string;
}
