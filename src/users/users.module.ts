import { Module } from '@nestjs/common';

// Service
import { UsersService } from './users.service';
import { TokenService } from '../token/token.service';

import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
// import { RefreshToken } from '../token/refresh-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      // RefreshToken
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.ACCESS_TOKEN_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, TokenService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
