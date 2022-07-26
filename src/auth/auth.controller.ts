import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import {
  AuthLoginDto,
  // RefreshTokenDOT
} from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Post('auth/login')
  async login(@Body() authLoginDto: AuthLoginDto, @Request() req) {
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getUser(parseInt(req.user.userId));
    return { user };
  }

  // @Post('refresh')
  // async refresh(@Body() refreshTokenDOT: RefreshTokenDOT) {
  //   const { user, token } =
  //     await this.tokenService.createAccessTokenFromRefreshToken(
  //       refreshTokenDOT.refresh_token,
  //     );
  //
  //   const payload = this.tokenService.buildResponsePayload(user, token);
  //
  //   return {
  //     status: 'success',
  //     data: payload,
  //   };
  // }
}
