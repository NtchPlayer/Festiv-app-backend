import { Body, Controller, Get, Post, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto';
import { Public } from '../decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('auth/login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getUser(parseInt(req.user.userId));
    return { user };
  }
}
