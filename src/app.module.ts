import { Module } from '@nestjs/common';

// External Library
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// Entity
import { User } from './users/user.entity';
import { Publication } from './publications/publication.entity';
import { Media } from './medias/media.entity';
// import { RefreshToken } from './token/refresh-token.entity';

// Controller
import { AppController } from './app.controller';

// Module
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PublicationsModule } from './publications/publications.module';
import { MediasModule } from './medias/medias.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        IS_DEV: Joi.boolean().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Publication, Media],
      synchronize: Boolean(process.env.IS_DEV) || false,
    }),
    AuthModule,
    UsersModule,
    PublicationsModule,
    MediasModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
