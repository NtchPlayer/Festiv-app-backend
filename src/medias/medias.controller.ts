import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { MediasService } from './medias.service';
import { Express } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './file-helpers';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  // @Get()
  // getAll(): Promise<Publication[]> {
  //   return this.publicationsService.findAll();
  // }
  //
  // @Get('/:id')
  // getOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.publicationsService.findOne(id);
  // }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.mediasService.addAvatar(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @Post('post')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediasService.addPostImage(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  // @Put('/:id')
  // async update(
  //   @Body() updatePublicationDto: UpdatePublicationDto,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.publicationsService.update(updatePublicationDto, id);
  // }
  //
  // @Delete('/:id')
  // async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
  //   return this.publicationsService.deleteOne(id, req.user.userId);
  // }
}
