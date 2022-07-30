export interface AuthPayloadDto {
  id: number;
  email: string;
  name: string;
  accessToken: string;
  refresh_token?: string;
}
