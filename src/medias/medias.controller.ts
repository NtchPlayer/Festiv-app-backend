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
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException('Invalid file provided');
    }
    return this.mediasService.addUserAvatar(file, parseInt(req.user.userId));
  }

  // @Post('publications')
  // @UseInterceptors(FileInterceptor('file'))
  // @UseInterceptors(
  //   FileInterceptor('filename', {
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
  //   if (!file || req.fileValidationError) {
  //     throw new BadRequestException('Invalid file provided');
  //   }
  //   return this.mediasService.addPublicationMedia(file);
  // }

  // @Put('/:id')
  // async update(
  //   @Body() updatePublicationDto: UpdatePublicationDto,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.publicationsService.update(updatePublicationDto, id);
  // }
  //
  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.mediasService.deletePublicationMedia(id);
  }
}
