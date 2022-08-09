import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Request,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { MediasService } from './medias.service';
import { Express } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException('Invalid file provided');
    }
    return this.mediasService.addUserAvatar(file, parseInt(req.user.userId));
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.mediasService.deletePublicationMedia(id);
  }
}
