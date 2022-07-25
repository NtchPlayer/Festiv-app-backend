export interface AuthPayloadDto {
  id: number;
  email: string;
  username: string;
  accessToken: string;
  refresh_token?: string;
}
