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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Publication } from './publication.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../medias/file-helpers';
import { Express } from 'express';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  getAll(): Promise<Publication[]> {
    return this.publicationsService.findAll();
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicationsService.findOne(id);
  }

  @Post('/add')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(
    FileInterceptor('filename', {
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(
    @Request() req,
    @Body() createPublicationDto: CreatePublicationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException('Invalid file provided');
    }
    return this.publicationsService.create(
      createPublicationDto,
      file,
      req.user,
    );
  }

  @Put('/:id')
  async update(
    @Body() updatePublicationDto: UpdatePublicationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.publicationsService.update(updatePublicationDto, id);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.publicationsService.deleteOne(id, req.user.userId);
  }
}
