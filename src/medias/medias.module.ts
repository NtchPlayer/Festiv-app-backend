import { Module } from '@nestjs/common';

// Service
import { UploadService } from './upload.service';
import { FilesService } from './files.service';
import { MediasController } from './medias.controller';

@Module({
  providers: [UploadService, FilesService],
  controllers: [MediasController],
  exports: [UploadService],
})
export class MediasModule {}
