import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { SignOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://api.balise360.fr',
  audience: 'https://www.balise360.fr',
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn: 60 * 60 * 24,
      subject: String(user.id),
    };

    return this.jwtService.signAsync(
      { name: user.name, email: user.email },
      opts,
    );
  }

  public buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthPayloadDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar?.url,
      accessToken,
      ...(refreshToken ? { refresh_token: refreshToken } : {}),
    };
  }
}
