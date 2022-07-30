import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    const user = await this.usersService.findByEmail(authLoginDto.email);
    if (!user) {
      throw new NotFoundException(
        "Aucun utilisateur n'est associé à cette adresse mail.",
      );
    }
    const valid = user
      ? await this.usersService.validateCredentials(user, authLoginDto.password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('Mot de passe incorrect.');
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
