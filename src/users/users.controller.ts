import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
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

    return this.tokenService.buildResponsePayload(
      user,
      accessToken,
      // refreshToken,
    );
  }

  @Get('festivals')
  async getFestivals() {
    return this.usersService.findFestivals();
  }

  @Get(':name')
  show(@Param('name') name: string) {
    const res = this.usersService.findByName(name);
    if (!res) {
      throw new NotFoundException("This user don't exist");
    }
    return res;
  }

  @Put('/update')
  async updateUser(@Request() req, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(parseInt(req.user.userId), data);
  }

  @Delete()
  async delete(@Request() req) {
    return this.usersService.deleteUser(parseInt(req.user.userId));
  }
}
