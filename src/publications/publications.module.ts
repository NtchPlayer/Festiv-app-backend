import { Module } from '@nestjs/common';

// Service
import { PublicationsService } from './publications.service';
import { UsersModule } from '../users/users.module';
import { MediasModule } from '../medias/medias.module';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication]), UsersModule, MediasModule],
  providers: [PublicationsService],
  controllers: [PublicationsController],
  exports: [PublicationsService],
})
export class PublicationsModule {}
