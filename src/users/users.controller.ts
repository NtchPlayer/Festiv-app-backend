import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Request,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { TokenService } from '../token/token.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Public } from '../decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const accessToken = await this.tokenService.generateAccessToken(user);
    // const refreshToken = await this.tokenService.generateRefreshToken(
    //   user,
    //   60 * 60 * 24 * 30,
    // );

    const payload = this.tokenService.buildResponsePayload(
      user,
      accessToken,
      // refreshToken,
    );

    return payload;
  }

  @Get(':name')
  show(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Put('/update')
  async updateUser(@Request() req, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(req.user.userId, data);
  }
}
