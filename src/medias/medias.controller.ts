import {
  Controller,
  Post,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { MediasService } from './medias.service';
import { Express } from 'express';
import { FileAvatarPipe } from '../pipes/file-avatar.pipe';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile(FileAvatarPipe) file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException('Invalid file provided');
    }
    return this.mediasService.addUserAvatar(file, parseInt(req.user.userId));
  }
}
