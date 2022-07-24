import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto';
import { User } from '../users/user.entity';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    let user: User;
    try {
      user = await this.usersService.findByEmail(authLoginDto.email);
    } catch (e) {
      throw new UnauthorizedException("This user don't exist.");
    }
    const valid = user
      ? await this.usersService.validateCredentials(user, authLoginDto.password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('The login is invalid');
    }

    const accessToken = await this.tokenService.generateAccessToken(user);
    // const refreshToken = await this.tokenService.generateRefreshToken(
    //   user,
    //   1000 * 60 * 60 * 24 * 30,
    // );

    return this.tokenService.buildResponsePayload(
      user,
      accessToken,
      // refreshToken,
    );
  }

  async getUser(userId: number): Promise<User> {
    try {
      const user = await this.usersService.findById(userId);
      delete user.password;
      // delete user.id;
      delete user.createdAt;
      delete user.updatedAt;
      return user;
    } catch {
      throw new UnauthorizedException("This user don't exist.");
    }
  }
}
