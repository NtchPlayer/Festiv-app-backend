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
  Query,
} from '@nestjs/common';

import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilesPublicationPipe } from '../pipes/files-publication.pipe';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get('/')
  getAll(
    @Request() req,
    @Query('name') name?: string,
    @Query('hashtag') hashtag?: string,
    @Query('q') q?: string,
  ) {
    return this.publicationsService.findAll(
      name,
      hashtag,
      q,
      parseInt(req.user.userId),
    );
  }

  @Get('/user/:name')
  getByNameAll(@Param('name') name: string, @Request() req) {
    return this.publicationsService.findByName(name, parseInt(req.user.userId));
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.publicationsService.findOne(id, parseInt(req.user.userId));
  }

  @Post('/add')
  @UseInterceptors(FilesInterceptor('files[]'))
  create(
    @Request() req,
    @Body() createPublicationDto: CreatePublicationDto,
    @UploadedFiles(FilesPublicationPipe) files: Express.Multer.File[],
  ) {
    return this.publicationsService.create(
      createPublicationDto,
      files,
      req.user.userId,
    );
  }

  @Post('/like/:id')
  addLike(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.publicationsService.likePublication(
      id,
      parseInt(req.user.userId),
    );
  }

  @Delete('/like/:id')
  unLike(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.publicationsService.unlikePublication(
      id,
      parseInt(req.user.userId),
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
    return this.publicationsService.deleteOne(id, parseInt(req.user.userId));
  }
}
