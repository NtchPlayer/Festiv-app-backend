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
} from '@nestjs/common';

import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Publication } from './publication.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('files[]', 4))
  create(
    @Request() req,
    @Body() createPublicationDto: CreatePublicationDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.publicationsService.create(
      createPublicationDto,
      files,
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
