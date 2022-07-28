import { Module } from '@nestjs/common';

// Service
import { MediasService } from './medias.service';
import { FilesService } from './files.service';
import { MediasController } from './medias.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), UsersModule],
  providers: [MediasService, FilesService],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
