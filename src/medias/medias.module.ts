import { Module } from '@nestjs/common';

// Service
import { MediasService } from './medias.service';
import { FilesService } from './files.service';
import { MediasController } from './medias.controller';

@Module({
  providers: [MediasService, FilesService],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
