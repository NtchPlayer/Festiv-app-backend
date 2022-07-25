import {
  Injectable,
  // UnprocessableEntityException
} from '@nestjs/common';
import { User } from '../users/user.entity';
import {
  SignOptions,
  // TokenExpiredError
} from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto';
// import { RefreshToken } from './refresh-token.entity';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UsersService } from '../users/users.service';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://api.balise360.fr',
  audience: 'https://www.balise360.fr',
};

@Injectable()
export class TokenService {
  constructor(
    // @InjectRepository(RefreshToken)
    // private readonly refreshTokenRepository: Repository<RefreshToken>,
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
  //   const token = new RefreshToken();
  //
  //   token.user_id = user.id;
  //   token.is_revoked = false;
  //
  //   const expiration = new Date();
  //   expiration.setTime(expiration.getTime() + ttl);
  //
  //   token.expires = expiration;
  //
  //   await this.refreshTokenRepository.save(token);
  //
  //   return token;
  // }

  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn: 60 * 60 * 24,
      subject: String(user.id),
    };

    return this.jwtService.signAsync({ username: user.username }, opts);
  }

  // public async generateRefreshToken(
  //   user: User,
  //   expiresIn: number,
  // ): Promise<string> {
  //   // const token = await this.createRefreshToken(user, expiresIn);
  //
  //   const opts: SignOptions = {
  //     ...BASE_OPTIONS,
  //     expiresIn,
  //     subject: String(user.id),
  //     // jwtid: String(token.id),
  //   };
  //
  //   return this.jwtService.signAsync({}, opts);
  // }

  // public async resolveRefreshToken(encoded: string): Promise<{
  //   user: User;
  //   token: RefreshToken
  // }> {
  //   const payload = await this.decodeRefreshToken(encoded);
  //   const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
  //
  //   if (!token) {
  //     throw new UnprocessableEntityException('Refresh token not found');
  //   }
  //
  //   if (token.is_revoked) {
  //     throw new UnprocessableEntityException('Refresh token revoked');
  //   }
  //
  //   const user = await this.getUserFromRefreshTokenPayload(payload);
  //
  //   if (!user) {
  //     throw new UnprocessableEntityException('Refresh token malformed');
  //   }
  //
  //   return {
  //     user,
  //     token,
  //   };
  // }

  // public async createAccessTokenFromRefreshToken(
  //   refresh: string,
  // ): Promise<{ token: string; user: User }> {
  //   const { user } = await this.resolveRefreshToken(refresh);
  //
  //   const token = await this.generateAccessToken(user);
  //
  //   return { user, token };
  // }

  // private async decodeRefreshToken(
  //   token: string,
  // ): Promise<RefreshTokenPayloadDto> {
  //   try {
  //     return this.jwtService.verifyAsync(token);
  //   } catch (e) {
  //     if (e instanceof TokenExpiredError) {
  //       throw new UnprocessableEntityException('Refresh token expired');
  //     } else {
  //       throw new UnprocessableEntityException('Refresh token malformed');
  //     }
  //   }
  // }

  // private async getUserFromRefreshTokenPayload(
  //   payload: RefreshTokenPayloadDto,
  // ): Promise<User> {
  //   const subId = payload.sub;
  //
  //   if (!subId) {
  //     throw new UnprocessableEntityException('Refresh token malformed');
  //   }
  //
  //   return this.usersService.findById(subId);
  // }

  // private async getStoredTokenFromRefreshTokenPayload(
  //   payload: RefreshTokenPayloadDto,
  // ): Promise<RefreshToken | null> {
  //   const tokenId = payload.jti;
  //
  //   if (!tokenId) {
  //     throw new UnprocessableEntityException('Refresh token malformed');
  //   }
  //
  //   return this.findOne(tokenId);
  // }

  public buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthPayloadDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      accessToken,
      ...(refreshToken ? { refresh_token: refreshToken } : {}),
    };
  }

  // findOne(id: number): Promise<RefreshToken> {
  //   return this.refreshTokenRepository.findOneByOrFail({ id });
  // }
}
