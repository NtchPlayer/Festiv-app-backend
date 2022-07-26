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
} from '@nestjs/common';

import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Publication } from './publication.entity';

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
  async create(
    @Body() createPublicationDto: CreatePublicationDto,
    @Request() req,
  ) {
    return this.publicationsService.create(createPublicationDto, req.user);
  }

  @Put('/:id')
  async update(
    @Body() updatePublicationDto: UpdatePublicationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.publicationsService.update(updatePublicationDto, id);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.publicationsService.deleteOne(id);
  }
}
